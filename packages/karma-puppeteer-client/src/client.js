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

(function (global) {
  'use strict';

  function noCleanup() {}

  /**
   * Runs a function exposed by Puppeteer browser.
   * See `karma-puppeteer-launcher`.
   *
   * @param {string} methodName The name of the karmaPuppeteer method.
   * @return {*} Function result.
   */
  function puppeteerFunction(methodName) {
    return function () {
      var args = Array.prototype.slice.call(arguments, 0);
      var name = '__karma_puppeteer_' + methodName;
      if (!global[name]) {
        throw new Error('unknown method: ' + name);
      }
      return global[name].apply(null, args);
    };
  }

  /**
   * Runs a function exposed by Puppeteer browser, but replaces the element
   * provided as an argument with a unique selector. Thus, all Puppeteer APIs
   * that accept the selector, can also be passed the actual element reference.
   *
   * For instance, both are allowed: `click('.element1')` and `click(element1)`.
   *
   * @param {string} methodName The name of the karmaPuppeteer method.
   * @return {*} Function result.
   */
  function withSelector(methodName) {
    var func = puppeteerFunction(methodName);
    return function () {
      var args = Array.prototype.slice.call(arguments, 0);
      var node = args[0] && args[0].nodeType ? args[0] : null;
      var cleanup = noCleanup;
      if (node) {
        var uniqueId = Math.random();
        node.setAttribute('karma_puppeteer_id', uniqueId);
        args[0] = '[karma_puppeteer_id="' + uniqueId + '"]';
        cleanup = function () {
          node.removeAttribute('karma_puppeteer_id');
        };
      }
      return func.apply(null, args).then(
        function (value) {
          cleanup();
          return value;
        },
        function (reason) {
          cleanup();
          throw reason;
        }
      );
    };
  }

  // See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#class-keyboard.
  function keyboard() {
    function keyboardFunction(name) {
      return puppeteerFunction('keyboard_' + name);
    }
    return {
      seq: keyboardFunction('seq'),
      // See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#keyboardsendcharacterchar
      sendCharacter: keyboardFunction('sendCharacter'),
      // See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#keyboardtypetext-options
      type: keyboardFunction('type'),
    };
  }

  // See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#class-mouse.
  function mouse() {
    function mouseFunction(name) {
      return puppeteerFunction('mouse_' + name);
    }
    return {
      seq: mouseFunction('seq'),
    };
  }

  function clipboard() {
    function clipboardFunction(name) {
      return puppeteerFunction('clipboard_' + name);
    }
    return {
      copy: clipboardFunction('copy'),
      paste: clipboardFunction('paste'),
    };
  }

  window.karmaPuppeteer = {
    saveSnapshot: puppeteerFunction('saveSnapshot'),
    // See https://github.com/puppeteer/puppeteer/blob/v3.0.4/docs/api.md#pageclickselector-options
    click: withSelector('click'),
    clipboard: clipboard(),
    // See https://github.com/puppeteer/puppeteer/blob/v3.0.4/docs/api.md#pagefocusselector
    focus: withSelector('focus'),
    // See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#framehoverselector
    hover: withSelector('hover'),
    // See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#class-keyboard.
    keyboard: keyboard(),
    // See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#class-mouse.
    mouse: mouse(),
    // See https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#frameselectselector-values
    select: withSelector('select'),
  };
})(typeof window !== 'undefined' ? window : global);
