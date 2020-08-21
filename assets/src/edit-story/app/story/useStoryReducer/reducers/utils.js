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
import { LAYER_DIRECTIONS } from '../../../../constants';
import { ELEMENT_RESERVED_PROPERTIES } from '../types';
import objectWithout from '../../../../utils/objectWithout';
export { objectWithout };

export function intersect(first, ...rest) {
  if (!first || !rest || rest.length === 0) {
    return first;
  }

  return rest.reduce(
    (intersection, list) =>
      intersection.filter((value) => list.includes(value)),
    first
  );
}

export function isInsideRange(index, start, end) {
  return index >= start && index <= end;
}

export function moveArrayElement(array, oldPosition, newPosition) {
  // First remove from list.
  const element = array[oldPosition];
  const arrayWithoutElement = [
    ...array.slice(0, oldPosition),
    ...array.slice(oldPosition + 1),
  ];

  // Then re-insert at the right point
  return [
    ...arrayWithoutElement.slice(0, newPosition),
    element,
    ...arrayWithoutElement.slice(newPosition),
  ];
}

export function getAbsolutePosition({
  currentPosition,
  minPosition,
  maxPosition,
  desiredPosition,
}) {
  if (typeof desiredPosition === 'number') {
    return Math.min(maxPosition, Math.max(minPosition, desiredPosition));
  }

  if (typeof desiredPosition !== 'string') {
    return currentPosition;
  }

  switch (desiredPosition) {
    case LAYER_DIRECTIONS.FRONT:
      return maxPosition;
    case LAYER_DIRECTIONS.BACK:
      return minPosition;
    case LAYER_DIRECTIONS.FORWARD:
      return Math.min(maxPosition, currentPosition + 1);
    case LAYER_DIRECTIONS.BACKWARD:
      return Math.max(minPosition, currentPosition - 1);
    default:
      return currentPosition;
  }
}

export function updateElementWithUpdater(element, properties) {
  const updater =
    typeof properties === 'function' ? properties(element) : properties;
  const allowedProperties = objectWithout(updater, ELEMENT_RESERVED_PROPERTIES);
  if (Object.keys(allowedProperties).length === 0) {
    return element;
  }
  return { ...element, ...allowedProperties };
}

export function updateAnimations(oldAnimations, animationUpdates) {
  const newAnimations = oldAnimations.reduce((animations, animation) => {
    const updatedAnimation = animationUpdates[animation.id];

    // remove animation from lookup
    delete animationUpdates[animation.id];

    if (updatedAnimation?.delete) {
      // delete animation
      return animations;
    } else if (updatedAnimation) {
      // update animation
      return [...animations, updatedAnimation];
    } else {
      // No updates
      return [...animations, animation];
    }
  }, []);

  // add animations
  Object.values(animationUpdates).forEach((a) => newAnimations.push(a));

  return newAnimations;
}
