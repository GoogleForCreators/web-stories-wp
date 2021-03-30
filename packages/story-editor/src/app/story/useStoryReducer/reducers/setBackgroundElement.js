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
import objectWithout from '../../../../utils/objectWithout';
import { moveArrayElement, removeAnimationsWithElementIds } from './utils';

/**
 * Set background element on the current page to element matching the given id.
 *
 * If element id is null, default background element is restored.
 *
 * If page had a background element before, that element is removed!
 * If that element was the default background element, it will be remembered as such.
 * If the removed background element was in selection, selection is cleared.
 *
 * Default background element can never be "set to nothing" - only replaced by another
 * element.
 *
 * @param {Object} state Current state
 * @param {Object} payload Action payload
 * @param {number} payload.elementId Element id to set as background on the current page.
 * @return {Object} New state
 */
function setBackgroundElement(state, { elementId }) {
  const pageIndex = state.pages.findIndex(({ id }) => id === state.current);

  const page = state.pages[pageIndex];
  const currentBackgroundElement = page.elements[0];

  let newPage;
  let newSelection = state.selection;

  // If new id is null, clear background attribute and proceed
  if (elementId === null) {
    if (currentBackgroundElement.isDefaultBackground) {
      // Nothing to do here, we can't unset default background
      return state;
    }

    const defaultBackgroundElement = page.defaultBackgroundElement;

    // Unset isBackground and backgroundOverlay for the element, too.
    const elementsWithoutBackground = page.elements.map((element) => {
      if (element.isBackground) {
        return objectWithout(element, ['backgroundOverlay', 'isBackground']);
      }
      return element;
    });
    newPage = {
      ...page,
      elements: [defaultBackgroundElement, ...elementsWithoutBackground],
    };
  } else {
    // Does the element even exist or is it already background
    const elementPosition = page.elements.findIndex(
      ({ id }) => id === elementId
    );
    const isBackground = elementPosition === 0;
    const exists = elementPosition !== -1;
    if (!exists || isBackground) {
      return state;
    }

    // If current bg is default, save it as such
    const wasDefault = currentBackgroundElement.isDefaultBackground;
    const defaultBackgroundElement = wasDefault
      ? currentBackgroundElement
      : page.defaultBackgroundElement;

    // Slice first element out and update position
    const pageElements = page.elements.slice(1);
    const currentPosition = elementPosition - 1;

    // Also remove old element from selection
    if (state.selection.includes(currentBackgroundElement.id)) {
      newSelection = state.selection.filter(
        (id) => id !== currentBackgroundElement.id
      );
    }

    // Reorder elements and set element opacity to 100% because backgrounds
    // cannot be transparent.
    const newElements = moveArrayElement(pageElements, currentPosition, 0).map(
      (element) => {
        // Set isBackground for the element.
        if (element.id === elementId) {
          return {
            ...element,
            isBackground: true,
            ...(Object.prototype.hasOwnProperty.call(element, 'opacity') && {
              opacity: 100,
            }),
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
      defaultBackgroundElement,
      elements: newElements,
    };
  }

  // Remove any applied background animations
  // or exising element animations.
  const backgroundElementId = page.elements.find(
    (element) => element.isBackground
  );
  const newAnimations = removeAnimationsWithElementIds(page.animations, [
    elementId,
    backgroundElementId.id,
  ]);

  const newPages = [
    ...state.pages.slice(0, pageIndex),
    { ...newPage, animations: newAnimations || [] },
    ...state.pages.slice(pageIndex + 1),
  ];

  return {
    ...state,
    pages: newPages,
    selection: newSelection,
  };
}

export default setBackgroundElement;
