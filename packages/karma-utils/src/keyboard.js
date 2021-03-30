/*
 * Copyright 2021 Google LLC
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

const KEY_MAP = {
  ALT: 'Alt',
  COMMAND: 'Meta',
  CMD: 'Meta',
  CONTROL: 'Control',
  CNTRL: 'Control',
  DOWN: 'ArrowDown',
  ESC: 'Escape',
  LEFT: 'ArrowLeft',
  META: 'Meta',
  RIGHT: 'ArrowRight',
  SHIFT: 'Shift',
  TAB: 'Tab',
  UP: 'ArrowUp',
};

/**
 * @param {Array<{type: string, key: string, options: Object}>} array List of keys.
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
 * https://github.com/puppeteer/puppeteer/blob/main/src/USKeyboardLayout.ts.
 *
 * @param {string} key Key name.
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
    return isApple ? 'Backspace' : 'Delete';
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
 * Parses a given keyboard shortcut string into a key sequence.
 *
 * @param {string} shortcut Keyboard shortcut.
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

/**
 * Events utility for keyboard.
 *
 * The list of all keycodes is available in https://github.com/puppeteer/puppeteer/blob/main/src/common/USKeyboardLayout.ts.
 *
 * In addition to this, the following special codes are allowed:
 * - "mod": "Meta" on OSX and "Control" elsewhere.
 *
 * See https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#class-keyboard.
 */
class Keyboard {
  /**
   * @param {function():Promise} act Actor.
   */
  constructor(act) {
    this._act = act;

    this._events = {
      down: (key, options = {}) => {
        const type = 'down';
        return { type, key, options };
      },
      up: (key, options = {}) => {
        const type = 'up';
        return { type, key, options };
      },
      press: (key, options = {}) => {
        const type = 'press';
        return { type, key, options };
      },
    };
  }

  /**
   * A sequence of:
   * - `type: 'down`: [keyboard.down](https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#keyboarddownkey-options).
   * - `type: 'up'`: [keyboard.up](https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#keyboardupkey).
   * - `type: 'press'`: [keyboard.press](https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#keyboardpresskey-options).
   *
   * @param {Array<{type: string, key: string, options: Object}>|Function} arrayOrGenerator Sequence of key events.
   * @return {!Promise} Yields when the event is processed.
   */
  seq(arrayOrGenerator) {
    const array =
      typeof arrayOrGenerator === 'function'
        ? arrayOrGenerator(this._events)
        : arrayOrGenerator;
    const keys = cleanupKeys(array);
    return this._act(() => karmaPuppeteer.keyboard.seq(keys));
  }

  /**
   * Decodes and executes a sequence of keys corresponding to a shortcut,
   * such as "mod+b". In this example, "mod+b" will be translated into the
   * following sequence:
   * - down Meta (or Control for non-Mac)
   * - press KeyB
   * - up Meta
   *
   * @param {string} shortcut Keybord shortcut.
   * @return {!Promise} Yields when the event is processed.
   */
  shortcut(shortcut) {
    return this.seq(parseShortcutToSeq(shortcut));
  }

  /**
   * The `keyboard.down` API.
   *
   * See https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#keyboarddownkey-options
   *
   * @param {string} key Name of key to press, such as ArrowLeft
   * @param {Object} options Options
   * @return {!Promise} Yields when the event is processed.
   */
  down(key, options = {}) {
    return this.seq([this._events.down(key, options)]);
  }

  /**
   * The `keyboard.up` API.
   *
   * See https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#keyboardupkey
   *
   * @param {string} key Name of key to release, such as ArrowLeft.
   * @param {Object<{text: string}>} options Event options.
   * @return {!Promise} Yields when the event is processed.
   */
  up(key, options = {}) {
    return this.seq([this._events.up(key, options)]);
  }

  /**
   * The `keyboard.press` API.
   *
   * See https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#keyboardpresskey-options
   *
   * @param {string} key Name of key to press, such as ArrowLeft
   * @param {Object<{text: string, delay: number}>} options Event options.
   * @return {!Promise} Yields when the event is processed.
   */
  press(key, options = {}) {
    return this.seq([this._events.press(key, options)]);
  }

  /**
   * The `keyboard.type` API.
   *
   * Sends a keydown, keypress/input, and keyup event for each character in the
   * text.
   *
   * See https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#keyboardtypetext-options
   *
   * @param {string} text Text to type.
   * @param {Object<{delay: number}>} options Event options. Accepts `delay` option to wait between key presses
   * in milliseconds.
   * @return {!Promise} Yields when the event is processed.
   */
  type(text, options = {}) {
    return this._act(() => karmaPuppeteer.keyboard.type(text, options));
  }

  /**
   * The `keyboard.sendCharacter` API.
   *
   * Dispatches a keypress and input event. This does not send a keydown or
   * keyup event.
   *
   * See https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#keyboardsendcharacterchar
   *
   * @param {string} char Character to send into the page.
   * @return {!Promise} Yields when the event is processed.
   */
  sendCharacter(char) {
    return this._act(() => karmaPuppeteer.keyboard.sendCharacter(char));
  }
}

export default Keyboard;
