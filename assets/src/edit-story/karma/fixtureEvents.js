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
    this._mouse = new Mouse(act);
  }

  get keyboard() {
    return this._keyboard;
  }

  get mouse() {
    return this._mouse;
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

  /**
   * See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#framehoverselector.
   *
   * @param {Element} target The event target.
   * @param {Object} options The event options.
   * @return {!Promise} The promise when the event handling is complete.
   */
  hover(target, options = {}) {
    return this._act(() => karmaPuppeteer.hover(target, options));
  }

  /**
   * See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#frameselectselector-values
   *
   * Triggers a change and input event once all the provided options have been
   * selected.
   *
   * @param {Element} target The event target.
   * @param {Array<string>} values
   * @return {!Promise} The promise when the event handling is complete.
   */
  select(target, ...values) {
    return this._act(() => karmaPuppeteer.select(target, values));
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
    const type = 'down';
    return this.seq([{ type, key, options }]);
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
    const type = 'up';
    return this.seq([{ type, key, options }]);
  }

  /**
   * The `keyboard.press` API.
   *
   * See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#keyboardpresskey-options
   *
   * @param {string} key
   * @param {Object} options Accepts `delay` and `text` options.
   * @return {!Promise} Yields when the event is processed.
   */
  press(key, options = {}) {
    const type = 'press';
    return this.seq([{ type, key, options }]);
  }

  /**
   * The `keyboard.type` API.
   *
   * Sends a keydown, keypress/input, and keyup event for each character in the
   * text.
   *
   * See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#keyboardtypetext-options
   *
   * @param {string} text
   * @param {Object} options Accepts `delay` option to wait between key presses
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
   * See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#keyboardsendcharacterchar
   *
   * @param {string} char
   * @return {!Promise} Yields when the event is processed.
   */
  sendCharacter(char) {
    return this._act(() => karmaPuppeteer.keyboard.sendCharacter(char));
  }
}

/**
 * Events utility for mouse.
 *
 * See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#class-mouse.
 */
class Mouse {
  /**
   * @param {function():Promise} act
   */
  constructor(act) {
    this._act = act;
    this._mouseSeq = new MouseSeq();
  }

  /**
   * A sequence of:
   * - `type: 'down`: [mouse.down](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#mousedownoptions).
   * - `type: 'up'`: [mouse.up](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#mouseupoptions).
   * - `type: 'move'`: [mouse.move](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#mousemovex-y-options).
   * - `type: 'click'`: [mouse.click](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#mouseclickx-y-options).
   *
   * @param {Array<{type: string, x: number, y: number, options: Object}>|Function} arrayOrGenerator
   * @return {!Promise} Yields when the event is processed.
   */
  seq(arrayOrGenerator) {
    const array = typeof arrayOrGenerator === 'function' ? arrayOrGenerator(this._mouseSeq) : arrayOrGenerator;
    return this._act(() => karmaPuppeteer.mouse.seq(cleanupMouseEvents(array)));
  }

  /**
   * The `mouse.click` API.
   *
   * See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#mouseclickx-y-options
   *
   * @param {number} x
   * @param {number} y
   * @param {Object} options
   * @return {!Promise} Yields when the event is processed.
   */
  click(x, y, options = {}) {
    return this.seq([this._mouseSeq.click(x, y, options)]);
  }

  /**
   * The `mouse.down` API.
   *
   * See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#mousedownoptions
   *
   * @param {Object} options Accepts `button` and `clickCount` options.
   * @return {!Promise} Yields when the event is processed.
   */
  down(options = {}) {
    return this.seq([this._mouseSeq.down(options)]);
  }

  /**
   * The `mouse.up` API.
   *
   * See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#mouseupoptions
   *
   * @param {Object} options Accepts `button` and `clickCount` options.
   * @return {!Promise} Yields when the event is processed.
   */
  up(options = {}) {
    return this.seq([this._mouseSeq.up(options)]);
  }

  /**
   * The `mouse.move` API.
   *
   * See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#mousemovex-y-options
   *
   * @param {number} x
   * @param {number} y
   * @param {Object} options Accepts `steps` option for the number of
   * intermediate mousemove events.
   * @return {!Promise} Yields when the event is processed.
   */
  move(x, y, options = {}) {
    return this.seq([this._mouseSeq.move(x, y, options)]);
  }
}

class MouseSeq {
  constructor() {
  }

  click(x, y, options = {}) {
    const type = 'click';
    return { type, x, y, options };
  }

  down(options = {}) {
    const type = 'down';
    return { type, options };
  }

  up(options = {}) {
    const type = 'up';
    return { type, options };
  }

  move(x, y, options = {}) {
    const type = 'move';
    return { type, x, y, options };
  }

  moveTo(element, dx, dy, options = {}) {
    const {x, y, width, height} = element.getBoundingClientRect();
    // TODO
  }

  moveBy(dx, dy, options = {}) {
    // TODO
  }
};

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

/**
 * @param {Array<{type: string, x: number, y: number, options: Object}>} array
 * @return {Array<{type: string, x: number, y: number, options: Object}>} The cleaned
 * up array that can be accepted by the Puppeteer.
 */
function cleanupMouseEvents(array) {
  const { x: offsetX, y: offsetY } = window.frameElement
    ? window.frameElement.getBoundingClientRect()
    : { x: 0, y: 0 };
  return array.map(({ type, x, y, options }) => {
    const xy =
      x !== undefined && y !== undefined
        ? { x: x + offsetX, y: y + offsetY }
        : {};
    return {
      type,
      ...xy,
      options: options || {},
    };
  });
}

export default FixtureEvents;
