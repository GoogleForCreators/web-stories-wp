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
 * Internal dependencies
 */
import { OverlayType } from '../../../../utils/backgroundOverlay';
import { moveArrayElement } from './utils';

/**
 * Set background element on the current page to the given id.
 *
 * If element id is null, background id is cleared for the page.
 *
 * If page had a background element before, that element is deleted!
 * And if that element was selected, selection is cleared.
 *
 * @param {Object} state Current state
 * @param {Object} payload Action payload
 * @param {number} payload.elementId Element id to set as background on the current page.
 * @return {Object} New state
 */
function setBackgroundElement(state, { elementId }) {
  const pageIndex = state.pages.findIndex(({ id }) => id === state.current);

  const page = state.pages[pageIndex];

  let newPage;
  let newSelection = state.selection;

  // If new id is null, clear background attribute and proceed
  if (elementId === null) {
    if (!page.backgroundElementId) {
      // Nothing to do here, there isn't any background to clear
      return state;
    }

    // Unset isBackground for the element, too.
    const updatedElements = page.elements.map((element) => {
      if (element.isBackground) {
        return {
          ...element,
          isBackground: false,
        };
      }
      return element;
    });
    newPage = {
      ...page,
      elements: updatedElements,
      backgroundElementId: null,
      backgroundOverlay: OverlayType.NONE,
    };
  } else {
    // Does the element even exist or is it already background
    let elementPosition = page.elements.findIndex(({ id }) => id === elementId);
    if (elementPosition === -1 || page.backgroundElementId === elementId) {
      return state;
    }
    let pageElements = page.elements;

    // Check if we already had a background id.
    const hadBackground = Boolean(page.backgroundElementId);
    if (hadBackground) {
      // If so, slice first element out and update position
      pageElements = pageElements.slice(1);
      elementPosition = elementPosition - 1;

      // Also remove old element from selection
      if (state.selection.includes(page.backgroundElementId)) {
        newSelection = state.selection.filter(
          (id) => id !== page.backgroundElementId
        );
      }
    }

    // Reorder elements and set element opacity to 100% because backgrounds
    // cannot be transparent.
    const newElements = moveArrayElement(pageElements, elementPosition, 0).map(
      (element) => {
        // Set isBackground for the element.
        if (element.id === elementId) {
          return {
            ...element,
            opacity: 100,
            isBackground: true,
          };
        }
        return element;
      }
    );

    //  remove new element from selection if there's more than one element there
    if (state.selection.includes(elementId) && state.selection.length > 1) {
      newSelection = state.selection.filter((id) => id !== elementId);
    }

    newPage = {
      ...page,
      backgroundElementId: elementId,
      backgroundOverlay: OverlayType.NONE,
      elements: newElements,
    };
  }

  const newPages = [
    ...state.pages.slice(0, pageIndex),
    newPage,
    ...state.pages.slice(pageIndex + 1),
  ];

  return {
    ...state,
    pages: newPages,
    selection: newSelection,
  };
}

export default setBackgroundElement;
