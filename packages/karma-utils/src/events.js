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

/**
 * Internal dependencies
 */
import Keyboard from './keyboard';
import Clipboard from './clipboard';
import Mouse from './mouse';

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

export default FixtureEvents;
