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
 * @param element    DOM node to find current selection within.
 * @param clientX  Optional x coordinate of click.
 * @param clientY  Optional y coordinate of click.
 * @return Current selection start offset as seen in `element` or 0 if not found.
 */

interface CaretPosition {
  readonly offset: number;
  readonly offsetNode: Node;
  getClientRect(): DOMRect | null;
}

interface SelectionDocument extends Document {
  caretPositionFromPoint?: (x: number, y: number) => CaretPosition | null;
}

// Extend for wider browser support.
interface SelectionElement extends Node {
  document?: SelectionDocument;
}

function getCaretCharacterOffsetWithin(
  element: SelectionElement,
  clientX: number,
  clientY: number
): number {
  const doc = (element.ownerDocument || element.document) as SelectionDocument;
  const win = doc?.defaultView;
  if (typeof win?.getSelection !== 'undefined') {
    let range;
    if (clientX && clientY) {
      if (doc.caretPositionFromPoint) {
        const caretPosition = doc.caretPositionFromPoint(clientX, clientY);
        // Create a range from the caret position.
        if (caretPosition) {
          range = document.createRange();
          range.setStart(caretPosition.offsetNode, caretPosition.offset);
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- caretRangeFromPoint does not exist in FF, even though TS claims it always exists.
        // @ts-ignore
      } else if (doc.caretRangeFromPoint) {
        // Change 'user-select' temporarily to make getting the correct range work for Safari.
        // See https://github.com/googleforcreators/web-stories-wp/issues/7745.
        const elementsToAdjust =
          document.querySelectorAll<HTMLElement>('[data-fix-caret]');
        for (const elementToAdjust of elementsToAdjust) {
          elementToAdjust.style.webkitUserSelect = 'auto';
        }
        range = document.caretRangeFromPoint(clientX, clientY);
        for (const elementToAdjust of elementsToAdjust) {
          elementToAdjust.style.webkitUserSelect = 'none';
        }
      }
    }
    if (!range) {
      const sel = win.getSelection();
      if (sel && sel.rangeCount > 0) {
        range = win.getSelection()?.getRangeAt(0);
      }
    }
    if (range) {
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      // This is for ensuring that if the logic fails to get the correct offset, it won't cause unexpected behaviour.
      if (
        element.textContent &&
        preCaretRange.toString().length <= element.textContent.length
      ) {
        return preCaretRange.toString().length;
      }
    }
  }

  return 0;
}

export default getCaretCharacterOffsetWithin;
