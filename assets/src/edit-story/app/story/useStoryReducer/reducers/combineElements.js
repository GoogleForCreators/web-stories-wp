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
 * Combine elements by taking properties from a first item and
 * adding them to the given second item, then remove first item.
 *
 * First item has to be an element with a resource (some media element),
 * otherwise nothing happens.
 *
 * If second item is background element, copy some extra properties not
 * relevant while background, but relevant if unsetting as background.
 *
 * If the second item is the default background element,
 * save a copy of the old element as appropriate and remove flag.
 *
 * Updates selection to only include the second item after merge.
 *
 * @param {Object} state Current state
 * @param {Object} payload Action payload
 * @param {string} payload.firstId Element to take properties from
 * @param {string} payload.secondId Element to add properties to
 * @return {Object} New state
 */
function combineElements(state, { firstId, secondId }) {
  if (!firstId || !secondId) {
    return state;
  }

  const pageIndex = state.pages.findIndex(({ id }) => id === state.current);
  const page = state.pages[pageIndex];
  const elementPosition = page.elements.findIndex(({ id }) => id === firstId);
  const element = page.elements[elementPosition];

  const secondElementPosition = page.elements.findIndex(
    ({ id }) => id === secondId
  );
  const secondElement = page.elements[secondElementPosition];

  if (!element || !element.resource || !secondElement) {
    return state;
  }

  const newPageProps = secondElement.isDefaultBackground
    ? {
        defaultBackgroundElement: {
          ...secondElement,
          id: firstId,
        },
      }
    : {};

  const {
    resource,
    scale = 100,
    focalX = 50,
    focalY = 50,
    isFill = false,
    width,
    height,
    x,
    y,
  } = element;

  const newElement = {
    ...secondElement,
    resource,
    type: resource.type,
    scale,
    focalX,
    focalY,
    isFill,
    // Only remember these for backgrounds, as they're ignored while being background
    ...(secondElement.isBackground
      ? {
          width,
          height,
          x,
          y,
        }
      : {}),
    // Only unset if it was set
    ...(secondElement.isDefaultBackground
      ? { isDefaultBackground: false }
      : {}),
  };

  // Elements are now
  const elements = page.elements
    .filter(({ id }) => id !== firstId)
    .map((el) => (el.id === secondId ? newElement : el));

  const newPage = {
    ...page,
    elements,
    ...newPageProps,
  };

  const newPages = [
    ...state.pages.slice(0, pageIndex),
    newPage,
    ...state.pages.slice(pageIndex + 1),
  ];

  return {
    ...state,
    pages: newPages,
    selection: [secondId],
  };
}

export default combineElements;
