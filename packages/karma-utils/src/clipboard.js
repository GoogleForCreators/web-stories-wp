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

export default Clipboard;
