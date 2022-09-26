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
import { canSupportMultiBorder } from '@googleforcreators/masks';
import { DEFAULT_ATTRIBUTES_FOR_MEDIA } from '@googleforcreators/element-library';
import { produce } from 'immer';

/**
 * Internal dependencies
 */
import objectPick from '../../../../utils/objectPick';
import objectWithout from '../../../../utils/objectWithout';
import { removeAnimationsWithElementIds } from './utils';

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
 * @param {Object} draft Current state
 * @param {Object} payload Action payload
 * @param {string} payload.firstElement Element with properties to merge
 * @param {string} payload.secondId Element to add properties to
 * @param {boolean} payload.shouldRetainAnimations Is called from copy and paste
 */
export const combineElements = (
  draft,
  { firstElement, secondId, shouldRetainAnimations = true }
) => {
  if (!firstElement || !secondId) {
    return;
  }
  const firstId = firstElement.id;
  const element = firstElement;

  const page = draft.pages.find(({ id }) => id === draft.current);

  const secondElementPosition = page.elements.findIndex(
    ({ id }) => id === secondId
  );
  const secondElement = page.elements[secondElementPosition];

  if (!element || !element.resource || !secondElement) {
    return;
  }

  if (secondElement.isDefaultBackground) {
    page.defaultBackgroundElement = {
      ...secondElement,
      // But generate a new ID for this temp background element
      id: uuidv4(),
    };
  }

  const propsFromFirst = [
    'alt',
    'type',
    'resource',
    'scale',
    'focalX',
    'focalY',
    'tracks',
    'poster',
  ];

  // If the element we're dropping into is not background, maintain link and border.
  if (!secondElement.isBackground) {
    propsFromFirst.push('link');
    propsFromFirst.push('border');
    if (canSupportMultiBorder(secondElement)) {
      propsFromFirst.push('borderRadius');
    }
  } else {
    // If we're dropping into background, maintain the flip and overlay, too.
    // Only copy position properties for backgrounds, as they're ignored while being background
    // For non-backgrounds, elements should keep original positions from secondElement
    propsFromFirst.push('flip', 'overlay', 'width', 'height', 'x', 'y');
  }

  const newElement = {
    // First copy everything from existing element except if it was default background
    ...objectWithout(secondElement, ['isDefaultBackground']),
    // Then set sensible default attributes
    ...DEFAULT_ATTRIBUTES_FOR_MEDIA,
    // Then copy all relevant attributes from new element
    ...objectPick(element, propsFromFirst),
  };

  // Elements are now
  page.elements = page.elements
    // Remove first element if combining from existing id
    .filter(({ id }) => id !== firstId)
    // Update reference to second element
    .map((el) => (el.id === secondId ? newElement : el));

  // First element should always be the image getting applied to
  // new element. We want to remove any animations it has. Second
  // element should be an element with or without animations that
  // we want to retain.
  //
  // We want different behavior for copy and paste where we
  // replace the element's animation with any coming from the
  // newly pasted element.
  page.animations = removeAnimationsWithElementIds(
    page.animations,
    shouldRetainAnimations ? [firstId] : [firstId, secondId]
  );

  // Selection is always just second id
  draft.selection = [secondId];
};

export default produce(combineElements);
