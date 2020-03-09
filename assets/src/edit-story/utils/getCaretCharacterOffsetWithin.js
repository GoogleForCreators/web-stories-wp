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
 * This function finds the character offset within a certain element.
 *
 * For instance, given the following node with `_` marking the current selection start offset:
 *
 * ```
 * <p>Corgies are the <em>b_est</em>!</p>
 * ```
 *
 * This function would return 17 (`'Corgies are the b'.length`).
 *
 * If optional coordinates are given, the point under the coordinates will be used,
 * otherwise the current on-page selection will be used.
 *
 * This function includes some cross-browser optimization for older browsers even
 * though they aren't really supported by the editor at large (IE).
 *
 * @param {Node} element    DOM node to find current selection within.
 * @param {number} clientX  Optional x coordinate of click.
 * @param {number} clientY  Optional y coordinate of click.
 * @return {number} Current selection start offset as seen in `element` or 0 if not found.
 */
function getCaretCharacterOffsetWithin(element, clientX, clientY) {
  const doc = element.ownerDocument || element.document;
  const win = doc.defaultView || doc.parentWindow;
  if (typeof win.getSelection !== 'undefined') {
    let range;
    if (clientX && clientY) {
      if (doc.caretPositionFromPoint) {
        range = document.caretPositionFromPoint(clientX, clientY);
      } else if (doc.caretRangeFromPoint) {
        range = document.caretRangeFromPoint(clientX, clientY);
      }
    }
    if (!range) {
      const sel = win.getSelection();
      if (sel.rangeCount > 0) {
        range = win.getSelection().getRangeAt(0);
      }
    }
    if (range) {
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      return preCaretRange.toString().length;
    }
  }

  const sel = doc.selection;
  if (sel && sel.type !== 'Control') {
    const textRange = sel.createRange();
    if (clientX && clientY) {
      textRange.moveToPoint(clientX, clientY);
    }
    const preCaretTextRange = doc.body.createTextRange();
    preCaretTextRange.moveToElementText(element);
    preCaretTextRange.setEndPoint('EndToEnd', textRange);
    return preCaretTextRange.text.length;
  }

  return 0;
}

export default getCaretCharacterOffsetWithin;
