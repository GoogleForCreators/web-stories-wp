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
  DOWN: 'ArrowDown',
  ENTER: 'Enter',
  ESC: 'Escape',
  LEFT: 'ArrowLeft',
  META: 'Meta',
  RIGHT: 'ArrowRight',
  SHIFT: 'Shift',
  SPACE: 'Space',
  TAB: 'Tab',
  UP: 'ArrowUp',
};

/**
 * Events utility. Uses native and synthetic events as needed.
 */
class FixtureEvents {
  /**
   * @param {function():Promise} act Actor.
   */
  constructor(act) {
    this._act = act;
    this._keyboard = new Keyboard(act);
    this._mouse = new Mouse(act);
    this._clipboard = new Clipboard(act);
  }

  get keyboard() {
    return this._keyboard;
  }

  get mouse() {
    return this._mouse;
  }

  get clipboard() {
    return this._clipboard;
  }

  /**
   * Return a promise sleeping for a given number of milliseconds.
   *
   * @param {number} ms Number of milliseconds to wait
   * @return {!Promise} A promise resolving after the given time
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
   * See https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#framehoverselector.
   *
   * @param {Element} target The event target.
   * @param {Object} options The event options.
   * @return {!Promise} The promise when the event handling is complete.
   */
  hover(target, options = {}) {
    return this._act(() => karmaPuppeteer.hover(target, options));
  }

  /**
   * See https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#frameselectselector-values
   *
   * Triggers a change and input event once all the provided options have been
   * selected.
   *
   * @param {Element} target The event target.
   * @param {Array<string>} values Values of options to select.
   * @return {!Promise} The promise when the event handling is complete.
   */
  select(target, ...values) {
    return this._act(() => karmaPuppeteer.select(target, values));
  }
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

/**
 * Events utility for mouse.
 *
 * See https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#class-mouse.
 */
class Mouse {
  /**
   * @param {function():Promise} act Actor.
   */
  constructor(act) {
    this._act = act;

    this._xy = [0, 0];

    const relToDelta = (rel, size) => {
      if (!rel) {
        return 0;
      }
      if (typeof rel === 'number') {
        return rel;
      }
      if (rel.endsWith('%')) {
        const percent = parseFloat(rel) / 100;
        return size * percent;
      }
      throw new Error('Unknown rel size: ' + rel);
    };

    const elementXY = (element, relX, relY) => {
      const { x, y, width, height } = element.getBoundingClientRect();
      const dx = relToDelta(relX, width);
      const dy = relToDelta(relY, height);
      return [x + dx, y + dy];
    };

    this._events = {
      click: (x, y, options = {}) => {
        this._xy = [x, y];
        const type = 'click';
        return { type, x, y, options };
      },
      down: (options = {}) => {
        const type = 'down';
        return { type, options };
      },
      up: (options = {}) => {
        const type = 'up';
        return { type, options };
      },
      wheel: (options = {}) => {
        const type = 'wheel';
        return { type, options };
      },
      move: (x, y, options = {}) => {
        this._xy = [x, y];
        const type = 'move';
        return { type, x, y, options };
      },

      clickOn: (element, relX = 0, relY = 0, options = {}) => {
        const [x, y] = elementXY(element, relX, relY);
        this._xy = [x, y];
        return this._events.click(x, y, options);
      },

      moveRel: (element, relX = 0, relY = 0, options = {}) => {
        const [x, y] = elementXY(element, relX, relY);
        this._xy = [x, y];
        return this._events.move(x, y, options);
      },

      moveBy: (dx, dy, options = {}) => {
        let [x, y] = this._xy;
        x += dx;
        y += dy;
        this._xy = [x, y];
        return this._events.move(x, y, options);
      },
    };
  }

  /**
   * A sequence of:
   * - `type: 'down`: [mouse.down](https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#mousedownoptions).
   * - `type: 'up'`: [mouse.up](https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#mouseupoptions).
   * - `type: 'move'`: [mouse.move](https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#mousemovex-y-options).
   * - `type: 'click'`: [mouse.click](https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#mouseclickx-y-options).
   *
   * @param {Array<{type: string, x: number, y: number, options: Object}>|Function} arrayOrGenerator Array/Generator for event sequence.
   * @return {!Promise} Yields when the event is processed.
   */
  seq(arrayOrGenerator) {
    const array =
      typeof arrayOrGenerator === 'function'
        ? arrayOrGenerator(this._events)
        : arrayOrGenerator;
    return this._act(() => karmaPuppeteer.mouse.seq(cleanupMouseEvents(array)));
  }

  /**
   * The `mouse.click` API.
   *
   * See https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#mouseclickx-y-options
   *
   * @param {number} x X coordinates.
   * @param {number} y Y coordinates.
   * @param {Object} options Options.
   * @return {!Promise} Yields when the event is processed.
   */
  click(x, y, options = {}) {
    return this.seq([this._events.click(x, y, options)]);
  }

  /**
   * The `mouse.down` API.
   *
   * See https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#mousedownoptions
   *
   * @param {Object} options Accepts `button` and `clickCount` options.
   * @return {!Promise} Yields when the event is processed.
   */
  down(options = {}) {
    return this.seq([this._events.down(options)]);
  }

  /**
   * The `mouse.up` API.
   *
   * See https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#mouseupoptions
   *
   * @param {Object} options Accepts `button` and `clickCount` options.
   * @return {!Promise} Yields when the event is processed.
   */
  up(options = {}) {
    return this.seq([this._events.up(options)]);
  }

  /**
   * The `mouse.wheel` API.
   *
   * See https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#mousewheeloptions
   *
   * @param {Object} options Accepts `deltaX` and `deltaY` options.
   * @return {!Promise} Yields when the event is processed.
   */
  wheel(options = {}) {
    return this.seq([this._events.wheel(options)]);
  }

  /**
   * The `mouse.move` API.
   *
   * See https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#mousemovex-y-options
   *
   * @param {number} x X coordinates.
   * @param {number} y Y coordinates.
   * @param {Object} options Accepts `steps` option for the number of
   * intermediate mousemove events.
   * @return {!Promise} Yields when the event is processed.
   */
  move(x, y, options = {}) {
    return this.seq([this._events.move(x, y, options)]);
  }

  /**
   * Moves the mouse pointer to a position relative to the specified element
   * and calls `mouse.click` at that position.
   *
   * The position is calculated relative to the specified element. The
   * `relX` and `relY` can be either:
   * 1. A number specifying the pixel distance relative to the element's
   * top-left corner.
   * 2. A string with "%" suffix specifying the percent distance relative
   * to the element's top-left corner.
   *
   * For instance, to click on the center of an element, call
   * `clickOn(element, '50%', '50%')`.
   *
   * See https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#mouseclickx-y-options
   *
   * @param {Element} element Element.
   * @param {number|string} relX A relative pixel or percent value. Default is 0.
   * @param {number|string} relY A relative pixel or percent value. Default is 0.
   * @param {Object<{button: string, clickCount: number, delay: number}>} options Mouse click options.
   * @return {!Promise} Yields when the event is processed.
   */
  clickOn(element, relX = 0, relY = 0, options = {}) {
    return this.seq([this._events.clickOn(element, relX, relY, options)]);
  }

  /**
   * Moves the mouse pointer to a position relative to the specified element.
   *
   * The position is calculated relative to the specified element. The
   * `relX` and `relY` can be either:
   * 1. A number specifying the pixel distance relative to the element's
   * top-left corner.
   * 2. A string with "%" suffix specifying the percent distance relative
   * to the element's top-left corner.
   *
   * For instance, to move pointer to the center of an element, call
   * `moveRel(element, '50%', '50%')`.
   *
   * See https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#mousemovex-y-options
   *
   * @param {Element} element Element.
   * @param {number|string} relX A relative pixel or percent value. Default is 0.
   * @param {number|string} relY A relative pixel or percent value. Default is 0.
   * @param {Object<{steps: number}>} options Accepts `steps` option for the number of
   * intermediate mousemove events.
   * @return {!Promise} Yields when the event is processed.
   */
  moveRel(element, relX = 0, relY = 0, options = {}) {
    return this.seq([this._events.moveRel(element, relX, relY, options)]);
  }

  /**
   * Moves the mouse pointer to a position relative to the last position.
   *
   * See https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#mousemovex-y-options
   *
   * @param {number} dx A relative pixel value.
   * @param {number} dy A relative pixel value.
   * @param {Object} options Accepts `steps` option for the number of
   * intermediate mousemove events.
   * @return {!Promise} Yields when the event is processed.
   */
  moveBy(dx, dy, options = {}) {
    return this.seq([this._events.moveBy(dx, dy, options)]);
  }
}

/**
 * Events utility for clipboard.
 */
class Clipboard {
  /**
   * @param {function():Promise} act Actor.
   */
  constructor(act) {
    this._act = act;
  }

  /**
   * Copy whatever is currently selected to the clipboard
   *
   * @return {!Promise} Resolves when operation completes with a boolean success flag
   */
  copy() {
    return this._act(() => karmaPuppeteer.clipboard.copy());
  }

  /**
   * Paste whatever is in the clipboard to the currently active target
   *
   * @return {!Promise} Yields when the event is processed.
   */
  paste() {
    return this._act(() => karmaPuppeteer.clipboard.paste());
  }

  /**
   * Paste plain text by sending fake event to current target
   *
   * @param {string} plainText Plain-text string to paste
   */
  pastePlain(plainText) {
    const pasteEvent = Object.assign(
      new Event('paste', { bubbles: true, cancelable: true }),
      {
        clipboardData: {
          types: ['text/plain'],
          items: {
            length: 1,
            0: {
              kind: 'string',
              type: 'text/plain',
              getAsString: () => plainText,
            },
          },
          getData: () => plainText,
        },
      }
    );
    document.activeElement.dispatchEvent(pasteEvent);
  }
}

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
 * @param {Array<{type: string, x: number, y: number, options: Object}>} array List of events.
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
