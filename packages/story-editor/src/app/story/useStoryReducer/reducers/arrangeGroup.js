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
import { produce } from 'immer';

/**
 * Internal dependencies
 */
import { getAbsolutePosition } from './utils';

/**
 * Move group to a new position
 *
 * @param {Object} draft Current state
 * @param {Object} payload Action payload
 * @param {string} payload.groupId Id of group to move
 * @param {number|string} payload.position New position
 */
export const arrangeGroup = (draft, { groupId, position }) => {
  if (!groupId) {
    return;
  }

  const { elements, groups } = draft.pages.find(
    ({ id }) => id === draft.current
  );
  const isInGroup = (el) => el.groupId === groupId;

  // If group doesn't exist or doesn't have any elements, abort
  if (!groups?.[groupId] || !elements.some(isInGroup)) {
    return;
  }

  // Find group position in elements array
  const groupStartIndex = elements.findIndex(isInGroup);
  const groupEndIndex = elements.findLastIndex(isInGroup);
  const groupSize = groupEndIndex - groupStartIndex + 1;

  // Splice out the entire group and replace with dummy entry
  const groupSlice = elements.splice(groupStartIndex, groupSize, 'dummy');

  // Dummy entry is needed to calculate the new position as if the group is one entry
  const minPosition = 1;
  const maxPosition = elements.length - 1;
  const newPosition = getAbsolutePosition({
    currentPosition: groupStartIndex,
    minPosition,
    maxPosition,
    desiredPosition: position,
  });

  // remove the dummy entry
  elements.splice(elements.indexOf('dummy'), 1);

  // Insert the new elements at position
  elements.splice(newPosition, 0, ...groupSlice);
};

export default produce(arrangeGroup);
