/*
 * Copyright 2021 Google LLC
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
import {
  createNewStory,
  withExperimentalFeatures,
  publishStory,
  minWPVersionRequired,
  previewStory,
  withPlugin,
} from '@web-stories-wp/e2e-test-utils';

/**
 * Internal dependencies
 */
import * as schema from './schema.json';

describe('Shopping', () => {
  minWPVersionRequired('5.8');
  describe('Shopping schema', () => {
    withExperimentalFeatures(['shoppingIntegration']);
    withPlugin('woocommerce');
    it('should should match a valid schema', async () => {
      await createNewStory();
      await expect(page).toClick('[aria-controls="library-pane-shopping"]');
      await page.type('[aria-label="Product"]', 'Hoodie with Zipper');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
      await expect(page).toClick('button', { text: 'Insert product' });
      await publishStory();
      const previewPage = await previewStory(page);
      await previewPage.waitForSelector('amp-story-shopping-attachment script');

      // pull product data from the DOM
      const data = await previewPage.evaluate(() =>
        JSON.parse(
          document.querySelector('amp-story-shopping-attachment script')
            .textContent
        )
      );

      await page.bringToFront();
      await previewPage.close();
      expect(data.items).toHaveLength(1);
      expect(data.items[0]).toMatchSchema(schema);
    });
  });
});
