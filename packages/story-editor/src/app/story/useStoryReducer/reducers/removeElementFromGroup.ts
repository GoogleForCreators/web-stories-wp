/*
 * Copyright 2022 Google LLC
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
import { arrangeElement } from './arrangeElement';
import { getLastIndexOfGroup } from './utils';

/**
 * Remove element from group.
 *
 * @param {Object} draft Current state
 * @param {Object} payload Action payload
 * @param {number} payload.elementId Selected element id
 * @param {number} payload.groupId Selected element group id
 */
export const removeElementFromGroup = (draft, { elementId, groupId }) => {
  const page = draft.pages.find(({ id }) => id === draft.current);
  const { elements } = page;
  const element = elements.find(({ id }) => id === elementId);
  if (element.groupId !== groupId) {
    return;
  }

  // Find out where to move the element to
  const position = getLastIndexOfGroup({ elements, groupId });

  // Only then delete the group id property
  delete element.groupId;

  // If already at last index of group, nothing left to do
  if (elements[position] === element) {
    return;
  }

  // Otherwise move
  arrangeElement(draft, { elementId, position });
};

export default produce(removeElementFromGroup);
