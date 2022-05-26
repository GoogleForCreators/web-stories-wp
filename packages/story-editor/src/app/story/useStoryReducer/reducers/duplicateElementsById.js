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
 * External dependencies
 */
import { duplicateElement } from '@googleforcreators/elements';

/**
 * Duplicate all elements specified by `elementIds` on the current page.
 * Set selected elements to be the newly created elements.
 *
 * If given `elementIds` are not a list, do nothing.
 *
 * @param {Object} state Current state
 * @param {Object} payload Action payload
 * @param {Array.<string>} payload.elementIds Array of ids of elements to duplicate.
 * @return {Object} New state
 */
function duplicateElementsById(state, { elementIds }) {
  if (!Array.isArray(elementIds)) {
    return state;
  }

  const pageIndex = state.pages.findIndex(({ id }) => id === state.current);
  const oldPage = state.pages[pageIndex];

  const newPage = { ...oldPage };
  const newSelection = [];

  const currentPageProductIds = oldPage?.elements
    ?.filter(({ type }) => type === 'product')
    .map(({ product }) => product?.productId);

  elementIds.forEach((elementId) => {
    const elementIndex = newPage.elements.findIndex(
      ({ id }) => id === elementId
    );

    if (elementIndex < 0) {
      return;
    }

    const elementToDuplicate = newPage.elements[elementIndex];

    if (elementToDuplicate.isBackground) {
      return;
    }

    if (
      elementToDuplicate.type === 'product' &&
      currentPageProductIds.includes(elementToDuplicate?.product?.productId)
    ) {
      return;
    }

    const { element, elementAnimations } = duplicateElement({
      element: elementToDuplicate,
      animations: oldPage.animations,
      existingElements: oldPage.elements,
    });

    newSelection.push(element.id);

    newPage.animations = [...(newPage.animations || []), ...elementAnimations];
    newPage.elements = [
      ...newPage.elements.slice(0, elementIndex),
      elementToDuplicate,
      element,
      ...newPage.elements.slice(elementIndex + 1),
    ];

    return;
  });

  // Do nothing if no new elements
  if (!newSelection.length) {
    return state;
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

export default duplicateElementsById;
