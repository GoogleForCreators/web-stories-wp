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
import { PAGE_RESERVED_PROPERTIES } from '../types';
import { objectWithout } from './utils';

/**
 * Update page by id or current page if no id given.
 *
 * If id doesn't exist, nothing happens.
 *
 * Current page and selection is unchanged.
 *
 * @param {Object} state Current state
 * @param {Object} payload Action payload
 * @param {number} payload.pageId Page index to update. If null, update current page.
 * @param {number} payload.properties Object with properties to set for given page.
 * @return {Object} New state
 */
function updatePage(state, { pageId, properties }) {
  const idToUpdate = pageId === null ? state.current : pageId;

  const pageIndex = state.pages.findIndex(({ id }) => id === idToUpdate);
  if (pageIndex === -1) {
    return state;
  }

  const allowedProperties = objectWithout(properties, PAGE_RESERVED_PROPERTIES);

  const newPage = {
    ...state.pages[pageIndex],
    ...allowedProperties,
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

export default updatePage;
