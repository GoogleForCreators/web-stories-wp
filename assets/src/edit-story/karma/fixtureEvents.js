/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import { fireEvent } from '@testing-library/react';

const KEY_MAP = {
  ALT: 'Alt',
  COMMAND: 'Meta',
  CMD: 'Meta',
  CONTROL: 'Control',
  CNTRL: 'Control',
  ESC: 'Escape',
  META: 'Meta',
  SHIFT: 'Shift',
  TAB: 'Tab',
};

/**
 * Events utility. Uses native and synthetic events as needed.
 */
class FixtureEvents {
  /**
   * @param {function():Promise} act
   */
  constructor(act) {
    this._act = act;
    this._keyboard = new Keyboard(act);
  }

  get keyboard() {
    return this._keyboard;
  }

  /**
   * See https://github.com/puppeteer/puppeteer/blob/v3.0.4/docs/api.md#pageclickselector-options.
   *
   * @param {Element} target The event target.
   * @param {Object} options The event options.
   * @return {!Promise} The promise when the event handling is complete.
   */
  click(target, options = {}) {
    return this._act(() => karmaPuppeteer.click(target, options));
  }

  /**
   * See https://github.com/puppeteer/puppeteer/blob/v3.0.4/docs/api.md#pagefocusselector.
   *
   * @param {Element} target The event target.
   * @param {Object} options The event options.
   * @return {!Promise} The promise when the event handling is complete.
   */
  focus(target, options = {}) {
    return this._act(() => karmaPuppeteer.focus(target, options));
  }

  // @todo: look for a native way to implement this. See Puppeteer's
  // Mouse API (https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#class-mouse).
  pointerDown(element, options = {}) {
    const { pointerType = 'mouse' } = options;
    fireEvent.pointerDown(element, options);
    if (pointerType === 'mouse') {
      fireEvent.mouseDown(element, options);
    }
    return Promise.resolve();
  }

  // @todo: look for a native way to implement this.
  pointerUp(element, options = {}) {
    const { pointerType = 'mouse' } = options;
    fireEvent.pointerUp(element, options);
    if (pointerType === 'mouse') {
      fireEvent.mouseUp(element, options);
    }
    return Promise.resolve();
  }

  // @todo: look for a native way to implement this.
  mouseDown(element, options = {}) {
    return this.pointerDown(element, { ...options, pointerType: 'mouse' });
  }

  // @todo: look for a native way to implement this.
  mouseUp(element, options = {}) {
    return this.pointerUp(element, { ...options, pointerType: 'mouse' });
  }
}

/**
 * Events utility for keyboard.
 *
 * The list of all keycodes is available in https://github.com/puppeteer/puppeteer/blob/master/src/USKeyboardLayout.ts.
 *
 * In addition to this, the following special codes are allowed:
 * - "mod": "Meta" on OSX and "Control" elsewhere.
 *
 * See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#class-keyboard.
 */
class Keyboard {
  /**
   * @param {function():Promise} act
   */
  constructor(act) {
    this._act = act;
  }

  /**
   * A sequence of:
   * - `type: 'down`: [keyboard.down](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#keyboarddownkey-options).
   * - `type: 'up'`: [keyboard.up](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#keyboardupkey).
   * - `type: 'press'`: [keyboard.press](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#keyboardpresskey-options).
   *
   * @param {Array<{type: string, key: string, options: Object}>} array
   * @return {!Promise} Yields when the event is processed.
   */
  seq(array) {
    return this._act(() => karmaPuppeteer.keyboard.seq(cleanupKeys(array)));
  }

  /**
   * Decodes and executes a sequence of keys corresponding to a shortcut,
   * such as "mod+b". In this example, "mod+b" will be translated into the
   * following sequence:
   * - down Meta (or Control for non-Mac)
   * - press KeyB
   * - up Meta
   *
   * @param {string} shortcut
   * @return {!Promise} Yields when the event is processed.
   */
  shortcut(shortcut) {
    return this.seq(parseShortcutToSeq(shortcut));
  }

  /**
   * The `keyboard.down` API.
   *
   * See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#keyboarddownkey-options
   *
   * @param {string} key
   * @param {Object} options
   * @return {!Promise} Yields when the event is processed.
   */
  down(key, options = {}) {
    return this.seq([{ type: 'down', key, options }]);
  }

  /**
   * The `keyboard.up` API.
   *
   * See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#keyboardupkey-options
   *
   * @param {string} key
   * @param {Object} options
   * @return {!Promise} Yields when the event is processed.
   */
  up(key, options = {}) {
    return this.seq([{ type: 'up', key, options }]);
  }

  /**
   * The `keyboard.press` API.
   *
   * See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#keyboardpresskey-options
   *
   * @param {string} key
   * @param {Object} options
   * @return {!Promise} Yields when the event is processed.
   */
  press(key, options = {}) {
    return this.seq([{ type: 'press', key, options }]);
  }
}

/**
 * @param {Array<{type: string, key: string, options: Object}>} array
 * @return {Array<{type: string, key: string, options: Object}>} The cleaned
 * up array that can be accepted by the Puppeteer.
 */
function cleanupKeys(array) {
  return array.map(({ type, key, options }) => ({
    type,
    key: cleanupKey(key),
    options: options || {},
  }));
}

/**
 * Converts a key to the allowed key set. See
 * https://github.com/puppeteer/puppeteer/blob/master/src/USKeyboardLayout.ts.
 *
 * @param {string} key
 * @return {string} The cleaned up key that can be accepted by the Puppeteer.
 */
function cleanupKey(key) {
  const upperKey = key.toUpperCase();
  if (upperKey in KEY_MAP) {
    return KEY_MAP[upperKey];
  }
  const isApple = /iPhone|iPad|iPod|Mac/i.test(navigator.userAgent);
  if (upperKey === 'MOD') {
    return isApple ? 'Meta' : 'Control';
  }
  if (upperKey === 'DEL') {
    return isApple ? 'Delete' : 'Backspace';
  }
  if (upperKey.length === 1 && /[A-Z]/.test(upperKey)) {
    return `Key${upperKey}`;
  }
  if (upperKey.length === 1 && /[0-9]/.test(upperKey)) {
    return `Digit${upperKey}`;
  }
  return key;
}

/**
 * @param {string} shortcut
 * @return {Array<{type: string, key: string, options: Object}>} The sequence
 * corresponding to the shortcut.
 */
function parseShortcutToSeq(shortcut) {
  const parts = shortcut.split('+');
  // All shortcuts parts except for the last one generate down/up events
  // and the final part generates press event.
  const down = [];
  const up = [];
  for (let i = 0; i < parts.length - 1; i++) {
    down.push(parts[i]);
    up.unshift(parts[i]);
  }
  const last = parts[parts.length - 1];
  return [
    ...down.map((key) => ({ type: 'down', key })),
    { type: 'press', key: last },
    ...up.map((key) => ({ type: 'up', key })),
  ];
}

export default FixtureEvents;
