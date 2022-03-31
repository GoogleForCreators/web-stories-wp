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
import { v4 as uuidv4 } from 'uuid';
import { PAGE_HEIGHT, PAGE_WIDTH } from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import createNewElement from './createNewElement';

/** @typedef {import('../types').Element} Element */

/**
 * Gets x, y values for cloned element, ensuring it's not added out of the page.
 *
 * @param {number} originX Original X.
 * @param {number} originY Original Y.
 * @return {{x: (number), y: (number)}} Coordinates.
 */
export function getOffsetCoordinates(originX, originY) {
  const placementDiff = 30;
  const allowedBorderDistance = 20;
  const x = originX + placementDiff;
  const y = originY + placementDiff;
  return {
    x: PAGE_WIDTH - x > allowedBorderDistance ? x : placementDiff,
    y: PAGE_HEIGHT - y > allowedBorderDistance ? y : placementDiff,
  };
}

/**
 * returns a copy of element and element's animations as well
 * as offsetting the elements position if the new element is based
 * on any existing element on the page.
 *
 * @param {Object} args - named arguments
 * @param {Element} args.element - story element to be coppied
 * @param {Array<Object>} args.animations - set of existing animations
 * @param {Array<Element>} args.existingElements - set of existing story elements
 * @return {{element: Element, elementAnimations: Array<Object>}} cloned story element and associated cloned animations
 */
function duplicateElement({ element, animations = [], existingElements = [] }) {
  const { type, ...attrs } = element;
  const duplicatedElement = {
    ...element,
    ...createNewElement(type, attrs),
  };
  duplicatedElement.basedOn = element.id;

  existingElements.forEach((existingElement) => {
    if (
      existingElement.id === duplicatedElement.basedOn ||
      existingElement.basedOn === duplicatedElement.basedOn
    ) {
      const pastedXY = getOffsetCoordinates(
        duplicatedElement.x,
        duplicatedElement.y
      );
      duplicatedElement.x = pastedXY.x;
      duplicatedElement.y = pastedXY.y;
    }
  });

  const duplicatedAnimations = animations
    .filter((animation) => animation.targets.includes(element.id))
    .map((animation) => ({
      ...animation,
      targets: [duplicatedElement.id],
      id: uuidv4(),
    }))
    .filter((animation) => animation.targets.length > 0);

  return {
    element: duplicatedElement,
    elementAnimations: duplicatedAnimations,
  };
}

export default duplicateElement;
