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
 * WordPress dependencies
 */
import { searchForBlock } from '@wordpress/e2e-test-utils';

/**
 * Retrieves the document container by css class and checks
 * to make sure the document's active element is within it.
 *
 * Differs from waitForInserterCloseAndContentFocus() in `@wordpress/e2e-test-utils`
 * by using a simpler selector and optional chaining to avoid crashes.
 */
async function waitForInserterCloseAndContentFocus() {
  await page.waitForFunction(() =>
    document.body
      .querySelector('.block-editor-block-list__layout')
      ?.contains(document.activeElement)
  );
}

/**
 * Opens the inserter, searches for the given term, then selects the first
 * result that appears. It then waits briefly for the block list to update.
 *
 * Avoids using waitForInserterCloseAndContentFocus() from `@wordpress/e2e-test-utils`
 * because the selector it relies on does not exist in older versions of Gutenberg.
 *
 * @param {string} searchTerm The text to search the inserter for.
 */
async function insertBlock(searchTerm) {
  await searchForBlock(searchTerm);
  expect(page).toClick('button span', { text: searchTerm });
  // We should wait until the inserter closes and the focus moves to the content.
  await waitForInserterCloseAndContentFocus();
}

export default insertBlock;
