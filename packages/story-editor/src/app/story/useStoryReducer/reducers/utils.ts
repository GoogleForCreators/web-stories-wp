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
import type { Animation, Element, Page } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { LAYER_DIRECTIONS } from '../../../../constants';
import { ELEMENT_RESERVED_PROPERTIES } from '../types';
import objectWithout from '../../../../utils/objectWithout';
import type { ElementUpdater } from '../../../../types';
export { objectWithout };

export function intersect(first: string[], ...rest: string[][]) {
  if (!first || !rest?.length) {
    return first;
  }

  return rest.reduce(
    (intersection, list) =>
      intersection.filter((value) => list.includes(value)),
    first
  );
}

export function isInsideRange(index: number, start: number, end: number) {
  return index >= start && index <= end;
}

export function moveArrayElement(
  array: Page[] | Element[],
  oldPosition: number,
  newPosition: number
) {
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

interface PositionProps {
  currentPosition: number;
  minPosition: number;
  maxPosition: number;
  desiredPosition: string | number;
}
export function getAbsolutePosition({
  currentPosition,
  minPosition,
  maxPosition,
  desiredPosition,
}: PositionProps) {
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

export function updateElementWithUpdater(
  element: Element,
  properties: Partial<Element> | ElementUpdater
): null | void {
  const updater =
    typeof properties === 'function' ? properties(element) : properties;
  const allowedProperties: Partial<Element> | Element = objectWithout(
    updater,
    ELEMENT_RESERVED_PROPERTIES
  );
  if (Object.keys(allowedProperties).length === 0) {
    return null;
  }
  if ('animation' in allowedProperties) {
    return allowedProperties.animation;
  }
  Object.assign(element, allowedProperties);
  return null;
}

export function removeAnimationsWithElementIds(
  animations: Animation[] = [],
  ids: string[] = []
) {
  return animations.reduce((accum: Animation[], animation) => {
    if (ids.some((id) => animation.targets?.includes(id))) {
      return accum;
    }
    return [...accum, animation];
  }, [] as Animation[]);
}

export function updateAnimations(
  oldAnimations: Animation[],
  animationUpdates: Animation[]
) {
  const newAnimations = oldAnimations.reduce(
    (animations: Animation[], animation) => {
      const updatedAnimation = animationUpdates[animation.id] as Animation;

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
    },
    []
  );

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

interface Entry {
  id: string;
}
/**
 * Remove duplicate entries. Uses last instance if
 * multiple entries share the same id.
 *
 * @param entries - set of entries with possible duplicate Ids
 * @return New set of entries with only unique Ids
 */
export function removeDuplicates(entries: Entry[] = []) {
  // Use only last of multiple elements with same id by turning into an object and getting the values.
  return Object.values(
    Object.fromEntries(entries.map((entry) => [entry.id, entry]))
  );
}

/**
 * Takes to sets of entries and returns unique entries
 * (keying on id) of right set not present in left set.
 *
 * @param left - base set of entries
 * @param right - new entries
 * @return - right exclusion of sets set
 */
export function exclusion(left: Entry[] = [], right: Entry[] = []) {
  const rightSet = removeDuplicates(right);
  const leftJoinKeys = left.map(({ id }) => id);
  return rightSet.filter(({ id }) => !leftJoinKeys.includes(id));
}

/**
 * Calculate the last index of a group.
 *
 * @param props Props
 * @param props.elements Elements array
 * @param props.groupId Group id
 * @return Last index of group
 */
export function getLastIndexOfGroup({
  elements,
  groupId,
}: {
  elements: Element[];
  groupId: string;
}) {
  const isMember = (e: Element) => e.groupId === groupId;
  const firstGroupElemenIndex = elements.findIndex(isMember);
  const groupSize = elements.filter(isMember).length;
  return firstGroupElemenIndex + groupSize - 1;
}
