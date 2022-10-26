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
import type { Element, Animation } from '@googleforcreators/types';

/**
 * Internal dependencies
 */
import createNewElement from './createNewElement';

/**
 * Gets x, y values for cloned element, ensuring it's not added out of the page.
 *
 * @param originX Original X.
 * @param originY Original Y.
 * @return Coordinates.
 */
export function getOffsetCoordinates(originX: number, originY: number) {
  const placementDiff = 30;
  const allowedBorderDistance = 20;
  const x = originX + placementDiff;
  const y = originY + placementDiff;
  return {
    x: PAGE_WIDTH - x > allowedBorderDistance ? x : placementDiff,
    y: PAGE_HEIGHT - y > allowedBorderDistance ? y : placementDiff,
  };
}

interface DuplicateElementArgs {
  element: Element;
  animations?: Animation[];
  existingElements?: Element[];
}

/**
 * returns a copy of element and element's animations as well
 * as offsetting the elements position if the new element is based
 * on any existing element on the page.
 *
 * @param args Named arguments
 * @param args.element Story element to be copied
 * @param args.animations Set of existing animations
 * @param args.existingElements Set of existing story elements
 * @return cloned story element and associated cloned animations
 */
function duplicateElement({
  element,
  animations = [],
  existingElements = [],
}: DuplicateElementArgs) {
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
    element: duplicatedElement as Element,
    elementAnimations: duplicatedAnimations as Animation[],
  };
}

export default duplicateElement;
