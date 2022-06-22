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
import { getAbsolutePosition } from './utils';

/**
 * Move group to a new position
 *
 * @param {Object} state Current state
 * @param {Object} payload Action payload
 * @param {string} payload.groupId Id of group to move
 * @param {number|string} payload.position New position
 * @return {Object} New state
 */
function arrangeGroup(state, { groupId, position }) {
  if (!groupId) {
    return state;
  }

  const pageIndex = state.pages.findIndex(({ id }) => id === state.current);
  const page = state.pages[pageIndex];
  const isInGroup = (el) => el.groupId === groupId;

  const hasElementsInGroup = page.elements.some(isInGroup);
  if (!page.groups?.[groupId] || !hasElementsInGroup) {
    return state;
  }

  const groupStartIndex = page.elements.findIndex(isInGroup);
  const groupEndIndex = page.elements.findLastIndex(isInGroup);

  const pageElements = [...page.elements];
  const groupSlice = pageElements.slice(groupStartIndex, groupEndIndex + 1);
  const newPageElements = [
    ...pageElements.slice(0, groupStartIndex),
    ...pageElements.slice(groupEndIndex + 1),
  ];
  const minPosition = 1;
  const maxPosition = page.elements.length - 1;
  const newPosition = getAbsolutePosition({
    currentPosition: position - 1,
    minPosition,
    maxPosition,
    desiredPosition: position - 1,
  });
  newPageElements.splice(newPosition, 0, ...groupSlice);

  const newPages = [
    ...state.pages.slice(0, pageIndex),
    {
      ...page,
      elements: newPageElements,
    },
    ...state.pages.slice(pageIndex + 1),
  ];

  return {
    ...state,
    pages: newPages,
  };
}

export default arrangeGroup;
