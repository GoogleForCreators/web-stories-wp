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
 * External dependencies
 */
import { produce } from 'immer';

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
 * @param {Object} draft Current state
 * @param {Object} payload Action payload
 * @param {number} payload.pageId Page id to delete. If null, delete current page
 */
export const deletePage = (draft, { pageId }) => {
  if (draft.pages.length <= 1) {
    return;
  }

  const idToDelete = pageId === null ? draft.current : pageId;

  const pageIndex = draft.pages.findIndex(({ id }) => id === idToDelete);
  if (pageIndex === -1) {
    return;
  }

  draft.pages.splice(pageIndex, 1);

  if (idToDelete === draft.current) {
    // New current page is at the same index unless it's off the end of the array
    const newCurrentIndex = Math.min(draft.pages.length - 1, pageIndex);
    draft.current = draft.pages[newCurrentIndex].id;
  }

  draft.selection = [];
};

export default produce(deletePage);
