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
 * Update group by id.
 *
 * @param {Object} state Current state
 * @param {Object} payload Action payload
 * @param {number} payload.groupId Group id
 * @param {number} payload.properties Object with properties to set for given group.
 * @return {Object} New state
 */
function updateGroup(state, { groupId, properties }) {
  const pageIndex = state.pages.findIndex(({ id }) => id === state.current);

  const updatedGroups = {
    ...state.pages[pageIndex].groups,
    [groupId]: {
      ...state.pages[pageIndex].groups[groupId],
      ...properties,
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

export default updateGroup;
