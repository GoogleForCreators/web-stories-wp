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
import { getAbsolutePosition, moveArrayElement } from './utils';

/**
 * Move element in element order on the current page (optionally handle group id when moved in the Layers Panel).
 *
 * If no element is given, check if selection only has one element, and if so, use that.
 * If no element is given and selection is empty or has multiple elements, state is unchanged.
 *
 * If the element does not exist on the current page, state is unchanged.
 *
 * If the element is background element, state is unchanged (you can't reorder the background).
 *
 * Element is given by id and must be moved to the given position.
 * The position can either be a number from 0 to the number of elements, or a string
 * equal to one of the constants: FRONT, BACK, FORWARD, BACKWARD.
 *
 * FRONT is the same as moving to the highest possible number. BACK is the same as moving to 0.
 *
 * FORWARD and BACKWARD is changing the elements relative position by plus or minus 1 respectively.
 *
 * If there is a current background element, both BACK and position 0 is treated as position 1.
 *
 * If element is already at the desired position, state is unchanged.
 *
 * If group is set to a specific id, that id is enforced and will be copied to group.
 * If group is set to null or undefined, group is required to not be present and will be removed.
 * If group is unset or set to false, group will be ignored whether set or not and will not be changed or removed.
 *
 * Selection and current page is unchanged.
 *
 * TODO: Handle multi-element re-order when UX and priority is finalized.
 *
 * @param {Object} draft Current state
 * @param {Object} payload Action payload
 * @param {string} payload.elementId Id of element to move
 * @param {number|string} payload.position New position of element to move
 * @param {string|boolean} payload.groupId New group id (when moving in the Layers Panel), false to skip updating.
 */
export const arrangeElement = (
  draft,
  { elementId, position, groupId = false }
) => {
  if (elementId === null && draft.selection.length !== 1) {
    return;
  }

  const idToArrange = elementId !== null ? elementId : draft.selection[0];

  const page = draft.pages.find(({ id }) => id === draft.current);

  // Abort if there's less than three elements (nothing to rearrange as first is bg)
  if (page.elements.length < 3) {
    return;
  }

  const currentPosition = page.elements.findIndex(
    ({ id }) => id === idToArrange
  );

  if (currentPosition === -1 || page.elements[0].id === idToArrange) {
    return;
  }

  const minPosition = 1;
  const maxPosition = page.elements.length - 1;
  const newPosition = getAbsolutePosition({
    currentPosition,
    minPosition,
    maxPosition,
    desiredPosition: position,
  });

  const currentGroupId = page.elements[currentPosition].groupId;

  // If it's already there, do nothing.
  if (currentPosition === newPosition && currentGroupId === groupId) {
    return;
  }

  // Update group id on current element
  if (groupId) {
    page.elements[currentPosition].groupId = groupId;
  } else if (groupId === undefined || groupId === null) {
    delete page.elements[currentPosition].groupId;
    // If there are no elements left in this group, remove the group as well.
    const groupHasElements = page.elements.find(
      ({ groupId: elGroupId }) => elGroupId === currentGroupId
    );
    if (!groupHasElements) {
      delete page.groups?.[currentGroupId];
    }
  }

  // Then reorder
  page.elements = moveArrayElement(page.elements, currentPosition, newPosition);
};

export default produce(arrangeElement);
