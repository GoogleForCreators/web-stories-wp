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
 * Moves focus to the selected block.
 */
async function focusSelectedBlock() {
  // Ideally there shouuld be a UI way to do this. (Focus the selected block)
  await page.evaluate(() => {
    wp.data
      .dispatch('core/block-editor')
      .selectBlock(
        wp.data.select('core/block-editor').getSelectedBlockClientId(),
        0
      );
  });
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
  await expect(page).toClick('button span', { text: searchTerm });
  await focusSelectedBlock();
}

export default insertBlock;
