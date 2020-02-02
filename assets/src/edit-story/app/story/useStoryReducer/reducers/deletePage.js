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
 * Delete page by id or delete current page if no id given.
 *
 * If another page than current page is deleted, it will remain current page.
 *
 * If the current page is deleted, the next page will become current.
 * If no next page, previous page will become current.
 *
 * If state only has one or zero pages, nothing happens.
 *
 * If a page is deleted, selection is cleared.
 *
 * @param {Object} state Current state
 * @param {Object} payload Action payload
 * @param {number} payload.pageId Page id to delete. If null, delete current page
 * @return {Object} New state
 */
function deletePage(state, { pageId }) {
  if (state.pages.length <= 1) {
    return state;
  }

  const idToDelete = pageId === null ? state.current : pageId;

  const pageIndex = state.pages.findIndex(({ id }) => id === idToDelete);

  if (pageIndex === -1) {
    return state;
  }

  const newPages = [
    ...state.pages.slice(0, pageIndex),
    ...state.pages.slice(pageIndex + 1),
  ];

  let newCurrent = state.current;

  if (idToDelete === state.current) {
    // Current page is at the same index unless it's off the end of the array
    const newCurrentIndex = Math.min(newPages.length - 1, pageIndex);
    newCurrent = newPages[newCurrentIndex].id;
  }

  return {
    ...state,
    pages: newPages,
    current: newCurrent,
    selection: [],
  };
}

export default deletePage;
