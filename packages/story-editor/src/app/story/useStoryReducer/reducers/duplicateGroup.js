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
import { produce } from 'immer';
import { duplicateElement } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { addGroup } from './addGroup';

/**
 * Duplicate group with all elements on the current page.
 * Set selected elements to be the newly created group.
 *
 * @param {Object} draft Current state
 * @param {Object} payload Action payload
 * @param {string} payload.oldGroupId Id of a group to duplicate.
 * @param {string} payload.groupId New group id.
 * @param {string} payload.name New group name.
 * @param {string} payload.isLocked Is group locked.
 */
export const duplicateGroup = (
  draft,
  { oldGroupId, groupId, name, isLocked }
) => {
  if (!oldGroupId || !groupId || !name) {
    return;
  }

  // Check that old group exists
  const page = draft.pages.find(({ id }) => id === draft.current);
  if (!page.groups?.[oldGroupId]) {
    return;
  }

  // Check that old group has members
  const isInGroup = (el) => el.groupId === oldGroupId;
  const members = page.elements.filter(isInGroup);
  if (!members.length) {
    return;
  }

  // Check that old group doesn't include background
  if (members.some(({ isBackground }) => isBackground)) {
    return;
  }

  // Add group
  addGroup(draft, { groupId, name, isLocked });

  // Create a list of the new elements to insert
  const newElements = members.map((oldElement) => {
    const { element, elementAnimations } = duplicateElement({
      element: oldElement,
      animations: page.animations,
      existingElements: page.elements,
    });

    element.groupId = groupId;

    if (elementAnimations.length) {
      // If duplicated element has animations, so does existing, so animations
      // array already exists
      page.animations.push(...elementAnimations);
    }

    return element;
  });

  // Insert the new elements at the right position
  const lastIndexOfOldGroup = page.elements.findLastIndex(isInGroup);
  page.elements.splice(lastIndexOfOldGroup + 1, 0, ...newElements);

  draft.selection = newElements.map(({ id }) => id);
};

export default produce(duplicateGroup);
