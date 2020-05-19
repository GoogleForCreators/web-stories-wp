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

/**
 * Events utility. Uses native and synthetic events as needed.
 */
class FixtureEvents {
  /**
   * @param {function():Promise} act
   */
  constructor(act) {
    this._act = act;
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
  // Keyboard API (https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#class-keyboard).
  keyDown(element, options = {}) {
    fireEvent.keyDown(element, options);
    return Promise.resolve();
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

export default FixtureEvents;
