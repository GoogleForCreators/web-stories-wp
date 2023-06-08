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
import type { StoryAnimation } from '@googleforcreators/animation';

/**
 * Internal dependencies
 */
import type { Element } from '../types';
import createNewElement from './createNewElement';
import getOffsetCoordinates from './getOffsetCoordinates';

/**
 * returns a copy of element and element's animations as well
 * as offsetting the elements position if the new element is based
 * on any existing element on the page.
 *
 * @param args - named arguments
 * @param args.element - story element to be coppied
 * @param args.animations - set of existing animations
 * @param args.currentElements - set of existing story elements
 * @param args.offsetBase - a point from which offset will be applied
 * @return cloned story element and associated cloned animations
 */
interface DuplicateElementArgs {
  element: Element;
  animations?: StoryAnimation[];
  currentElements?: Element[];
  offsetBase?: { x: number; y: number };
}
interface DuplicateElementReturn {
  element: Element;
  elementAnimations: StoryAnimation[];
}
function duplicateElement({
  element,
  animations = [],
  currentElements = [],
  offsetBase,
}: DuplicateElementArgs): DuplicateElementReturn {
  const { type, ...attrs } = element;
  const duplicatedElement = createNewElement(type, attrs);

  // update position with an offset if copied element is on canvas
  if (currentElements.map(({ id }) => id).includes(element.id)) {
    // use provided base offset if passed or offset from element's position
    const pastedXY = getOffsetCoordinates(
      offsetBase?.x ?? element.x,
      offsetBase?.y ?? element.y
    );
    duplicatedElement.x = pastedXY.x;
    duplicatedElement.y = pastedXY.y;
  }

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
