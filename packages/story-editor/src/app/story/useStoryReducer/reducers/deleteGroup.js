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
import deleteElements from './deleteElements';

/**
 * Delete group by id.
 *
 * @param {Object} state Current state
 * @param {Object} payload Action payload
 * @param {number} payload.groupId Group id
 * @param {boolean} payload.includeElements If also delete all elements in the group
 * @return {Object} New state
 */
function deleteGroup(state, { groupId, includeElements = false }) {
  const pageIndex = state.pages.findIndex(({ id }) => id === state.current);

  const updatedGroups = {
    ...state.pages[pageIndex].groups,
  };
  delete updatedGroups[groupId];

  const currentPage = state.pages[pageIndex];

  const newPage = {
    ...currentPage,
    groups: updatedGroups,
  };

  // Remove group elements.
  newPage.elements = newPage.elements.map((el) => {
    if (el.groupId === groupId) {
      const newEl = { ...el };
      delete newEl.groupId;
      return newEl;
    } else {
      return el;
    }
  });

  const newPages = [
    ...state.pages.slice(0, pageIndex),
    newPage,
    ...state.pages.slice(pageIndex + 1),
  ];

  const finalState = {
    ...state,
    pages: newPages,
  };

  if (includeElements) {
    const elementIds = currentPage.elements
      .filter((el) => groupId && el.groupId === groupId)
      .map((el) => el.id);
    return deleteElements(finalState, { elementIds });
  }

  return finalState;
}

export default deleteGroup;
