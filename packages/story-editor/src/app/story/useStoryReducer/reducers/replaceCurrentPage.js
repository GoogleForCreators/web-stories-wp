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
 * Replace current page with contents of new page.
 *
 * New page must have at least one element, the default background element.
 *
 * Selection is cleared.
 *
 * @param {Object} state Current state
 * @param {Object} payload Action payload
 * @param {Object} payload.page Object with properties of new page
 * @return {Object} New state
 */
function replaceCurrentPage(state, { page }) {
  // Ensure new page has at least one element
  if (!page.elements?.length >= 1) {
    return state;
  }

  const pageIndex = state.pages.findIndex(({ id }) => id === state.current);
  const currentPage = state.pages[pageIndex];

  const newPage = {
    ...page,
    id: currentPage.id,
  };

  const newPages = [
    ...state.pages.slice(0, pageIndex),
    newPage,
    ...state.pages.slice(pageIndex + 1),
  ];

  return {
    ...state,
    pages: newPages,
    selection: [],
  };
}

export default replaceCurrentPage;
