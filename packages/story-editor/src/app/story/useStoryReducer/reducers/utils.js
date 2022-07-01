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
  if (!first || !rest?.length) {
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
    return null;
  }
  if (allowedProperties.animation) {
    return allowedProperties.animation;
  }
  Object.assign(element, allowedProperties);
  return null;
}

export function removeAnimationsWithElementIds(animations = [], ids = []) {
  return animations.reduce((accum, animation) => {
    if (ids.some((id) => animation.targets?.includes(id))) {
      return accum;
    }
    return [...accum, animation];
  }, []);
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

/**
 * Entry must have {id: string, ...} prop on it. WIP
 * on enforcing this with jsdocs.
 *
 * @typedef {Object.<string, any>} Entry
 */

/**
 * Remove duplicate entries. Uses last instance if
 * multiple entries share the same id.
 *
 * @param {Array<Entry>} entries - set of entries with possible duplicate Ids
 * @return {Array<Entry>} New set of entries with only unique Ids
 */
export function removeDuplicates(entries = []) {
  // Use only last of multiple elements with same id by turning into an object and getting the values.
  return Object.values(
    Object.fromEntries(entries.map((entry) => [entry.id, entry]))
  );
}

/**
 * Takes to sets of entries and returns unique entries
 * (keying on id) of right set not present in left set.
 *
 * @param {Array<Entry>} left - base set of entries
 * @param {Array<Entry>} right - new entries
 * @return {Array<Entry>} - right exclusion of sets set
 */
export function exclusion(left = [], right = []) {
  const rightSet = removeDuplicates(right);
  const leftJoinKeys = left.map(({ id }) => id);
  return rightSet.filter(({ id }) => !leftJoinKeys.includes(id));
}

/**
 * Calculate top element postion outside of current group.
 *
 * @param {Object} state Current state
 * @param {Object} state.elements page elements
 * @param {number} state.elementId Selected element id
 * @param {number} state.groupId Selected element group id
 * @return {number} New postion
 */
export function getTopPositionOutsideGroup({
  elements = [],
  elementId,
  groupId,
}) {
  let count = 0;
  let currentPosition = 0;
  for (const [index] of Object.entries(elements).reverse()) {
    if (elements[index].id === elementId) {
      currentPosition = Number(index);
    }

    if (
      elements[index].groupId === groupId &&
      elements[index].id != elementId &&
      currentPosition === 0
    ) {
      count++;
    }
  }

  return currentPosition + count;
}
