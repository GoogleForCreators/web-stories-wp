/*
 * Copyright 2022 Google LLC
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
  minWPVersionRequired,
  withPlugin,
  insertProduct,
  setShoppingProvider
} from '@web-stories-wp/e2e-test-utils';

describe('Shopping product', () => {
  minWPVersionRequired('5.8');
  describe('Product menu', () => {
    withExperimentalFeatures(['shoppingIntegration']);
    withPlugin('woocommerce');
    beforeAll(async () => {
      await setShoppingProvider('WooCommerce');
    });

    function isStoryEmpty() {
      return page.evaluate(() => {
        if (document.getElementById('emptystate-message')) {
          return true;
        }
        return false;
      });
    }

    it('should show a floating menu with product dropdown', async () => {
      const productText = 'Hoodie with Zipper';
      await createNewStory();
      await expect(isStoryEmpty()).resolves.toBe(true);
      await insertProduct(productText);
      await expect(isStoryEmpty()).resolves.toBe(false);
      await page.waitForSelector(
        '[aria-label="Design menu"] [aria-label="Product"]'
      );
      await expect(page).toMatchElement(
        '[aria-label="Design menu"] [aria-label="Product"]',
        { text: productText }
      );
      await expect(page).toClick('button', { text: 'Remove product' });
      await expect(isStoryEmpty()).resolves.toBe(true);
    });
  });
});
