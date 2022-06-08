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
 * Add a group to the current page groups list (id, name).
 *
 * @param {Object} state Current state
 * @param {Object} payload Action payload
 * @param {Object} payload.groupId Group id
 * @param {Object} payload.name Group name
 * @return {Object} New state
 */
function addGroup(state, { groupId, name }) {
  const pageIndex = state.pages.findIndex(({ id }) => id === state.current);

  const updatedGroups = {
    ...state.pages[pageIndex].groups,
    [groupId]: {
      name,
      isLocked: false,
    },
  };

  const newPage = {
    ...state.pages[pageIndex],
    groups: updatedGroups,
  };

  const newPages = [
    ...state.pages.slice(0, pageIndex),
    newPage,
    ...state.pages.slice(pageIndex + 1),
  ];

  return {
    ...state,
    pages: newPages,
  };
}

export default addGroup;
