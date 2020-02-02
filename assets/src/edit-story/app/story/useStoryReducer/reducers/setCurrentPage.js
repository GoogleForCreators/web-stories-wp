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
 * Set current page to the given id.
 *
 * If id doesn't match an existing page, nothing happens.
 *
 * If page is changed, selection is cleared
 *
 * @param {Object} state Current state
 * @param {Object} payload Action payload
 * @param {number} payload.pageId Page id to set as current page
 * @return {Object} New state
 */
function setCurrentPage(state, { pageId }) {
  if (!state.pages.some(({ id }) => id === pageId)) {
    return state;
  }

  return {
    ...state,
    current: pageId,
    selection: [],
  };
}

export default setCurrentPage;
