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
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { DEFAULT_ATTRIBUTES_FOR_MEDIA } from '../../../../constants';
import objectPick from '../../../../utils/objectPick';
import objectWithout from '../../../../utils/objectWithout';

/**
 * Combine elements by taking properties from a first item and
 * adding them to the given second item, then remove first item.
 *
 *
 * First item must either to be the id of an existing element with
 * a resource (some media element, or be given as the properties of
 * an element (with a resource) that doesn't exist but whose properties
 * should be merged into the target element.
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
 * @param {string} payload.firstElement Element with properties to merge
 * @param {string} payload.secondId Element to add properties to
 * @return {Object} New state
 */
function combineElements(state, { firstId, firstElement, secondId }) {
  if ((!firstId && !firstElement) || !secondId) {
    return state;
  }

  const pageIndex = state.pages.findIndex(({ id }) => id === state.current);
  const page = state.pages[pageIndex];
  const elementPosition = page.elements.findIndex(({ id }) => id === firstId);
  const element =
    elementPosition > -1 ? page.elements[elementPosition] : firstElement;

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
          // But generate a new ID for this temp background element
          id: uuidv4(),
        },
      }
    : {};

  const mediaProps = objectPick(element, [
    'type',
    'resource',
    'scale',
    'focalX',
    'focalY',
    'flip',
  ]);

  const positionProps = objectPick(element, ['width', 'height', 'x', 'y']);

  const newElement = {
    // First copy everything from existing element except if it was default background
    ...objectWithout(secondElement, ['isDefaultBackground']),
    // Then set sensible default attributes
    ...DEFAULT_ATTRIBUTES_FOR_MEDIA,
    flip: {},
    // Then copy all media-related attributes from new element
    ...mediaProps,
    // Only copy position properties for backgrounds, as they're ignored while being background
    // For non-backgrounds, elements should keep original positions from secondElement
    ...(secondElement.isBackground ? positionProps : {}),
  };

  // Elements are now
  const elements = page.elements
    // Remove first element if combining from existing id
    .filter(({ id }) => id !== firstId)
    // Update reference to second element
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
