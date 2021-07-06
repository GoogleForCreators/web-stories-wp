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
import { canvas, searchForBlock } from '@wordpress/e2e-test-utils';
/**
 * Internal dependencies
 */
import focusSelectedBlock from './focusSelectedBlock';

/**
 * Retrieves the document container by css class and checks to make sure the document's active element is within it
 */
async function waitForInserterCloseAndContentFocus() {
  await canvas().waitForFunction(
    () =>
      document.activeElement.closest('.block-editor-block-list__layout') !==
      null
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
  const insertButton = await page.waitForXPath(
    `//button//span[contains(text(), '${searchTerm}')]`
  );
  await insertButton.click();
  await focusSelectedBlock();
  // We should wait until the inserter closes and the focus moves to the content.
  await waitForInserterCloseAndContentFocus();
}

export default insertBlock;
