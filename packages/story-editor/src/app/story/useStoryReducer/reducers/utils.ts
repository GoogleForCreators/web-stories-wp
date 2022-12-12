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
import type { Element } from '@googleforcreators/elements';
import type { StoryAnimation } from '@googleforcreators/animation';

/**
 * Internal dependencies
 */
import { LayerDirection } from '../../../../constants';
import { ELEMENT_RESERVED_PROPERTIES } from '../types';
import objectWithout from '../../../../utils/objectWithout';
import type { ElementUpdater } from '../../../../types';
export { objectWithout };

export function intersect<T>(first: T[], ...rest: T[][]) {
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

export function moveArrayElement<T>(
  array: T[],
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
  desiredPosition: LayerDirection | number;
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

  switch (desiredPosition) {
    case LayerDirection.Front:
      return maxPosition;
    case LayerDirection.Back:
      return minPosition;
    case LayerDirection.Forward:
      return Math.min(maxPosition, currentPosition + 1);
    case LayerDirection.Backward:
      return Math.max(minPosition, currentPosition - 1);
    default:
      return currentPosition;
  }
}

interface AllowedProperties extends Partial<Element> {
  animation: StoryAnimation;
}
function isWithAnimation(
  props: Partial<Element> | Element
): props is AllowedProperties {
  return 'animation' in props;
}
export function updateElementWithUpdater<T extends Element = Element>(
  element: T,
  properties: Partial<T> | ElementUpdater<T>
): null | void | StoryAnimation {
  const updater =
    typeof properties === 'function' ? properties(element) : properties;
  const allowedProperties: Partial<Element> | Element = objectWithout(
    updater,
    ELEMENT_RESERVED_PROPERTIES
  );
  if (Object.keys(allowedProperties).length === 0) {
    return null;
  }
  if (isWithAnimation(allowedProperties) && allowedProperties.animation) {
    return allowedProperties.animation;
  }
  Object.assign(element, allowedProperties);
  return null;
}

export function removeAnimationsWithElementIds(
  animations: StoryAnimation[] = [],
  ids: string[] = []
) {
  return animations.filter(
    ({ targets }) => !ids.some((id) => targets?.includes(id))
  );
}

type AnimationToDelete = StoryAnimation & {
  delete?: boolean;
};
export function updateAnimations(
  oldAnimations: StoryAnimation[],
  animationUpdates: Record<string, StoryAnimation>
) {
  const newAnimations = oldAnimations.reduce(
    (animations: StoryAnimation[], animation) => {
      const updatedAnimation = animationUpdates[animation.id];

      // remove animation from lookup
      delete animationUpdates[animation.id];

      if ((updatedAnimation as AnimationToDelete)?.delete) {
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
export function removeDuplicates<T extends Entry>(entries: T[] = []) {
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
export function exclusion<T extends Entry>(left: T[] = [], right: T[] = []) {
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
  const firstGroupElementIndex = elements.findIndex(isMember);
  const groupSize = elements.filter(isMember).length;
  return firstGroupElementIndex + groupSize - 1;
}
