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
  previewStory,
  withPlugin,
  insertProduct,
  setShoppingProvider,
} from '@web-stories-wp/e2e-test-utils';

/**
 * Internal dependencies
 */
import * as schema from './schema.json';

jest.retryTimes(3, { logErrorsBeforeRetry: true });

describe('Shopping', () => {
  describe('WooCommerce', () => {
    withPlugin('woocommerce');

    beforeAll(async () => {
      await setShoppingProvider('WooCommerce');
    });

    describe('Schema Validation', () => {
      it('should match a valid schema', async () => {
        await createNewStory();
        await insertProduct('Hoodie with Zipper', true);
        await insertProduct('Album', false);
        await insertProduct('Sunglasses', false);
        const previewPage = await previewStory();

        await previewPage.waitForSelector(
          'amp-story-shopping-attachment script'
        );

        // pull product data from the DOM
        const data = await previewPage.evaluate(() =>
          JSON.parse(
            document.querySelector('amp-story-shopping-attachment script')
              .textContent
          )
        );

        await page.bringToFront();
        await previewPage.close();
        const { items } = data;

        items.forEach((item) => {
          expect(item).toMatchSchema(schema);
        });

        // Since product IDs and attachment URLs can change between test runs / setups,
        // this changes them to something deterministic for the sake of this snapshot.
        // Note: Could also be done with a custom snapshot serializer.
        const normalizedItems = items.map((item) => ({
          ...item,
          productId: 'product-id',
          productImages: item.productImages.map((image) => ({
            ...image,
            url: 'product-image-url',
          })),
        }));

        // eslint-disable-next-line jest/no-large-snapshots
        expect(normalizedItems).toMatchInlineSnapshot(`
          [
            {
              "aggregateRating": {
                "ratingValue": 0,
                "reviewCount": 0,
                "reviewUrl": "http://localhost:8899/product/hoodie-with-zipper",
              },
              "productBrand": "",
              "productDetails": "This is a simple product.",
              "productId": "product-id",
              "productImages": [
                {
                  "alt": "",
                  "url": "product-image-url",
                },
              ],
              "productPrice": 45,
              "productPriceCurrency": "USD",
              "productTitle": "Hoodie with Zipper",
              "productUrl": "http://localhost:8899/product/hoodie-with-zipper",
            },
            {
              "aggregateRating": {
                "ratingValue": 0,
                "reviewCount": 0,
                "reviewUrl": "http://localhost:8899/product/album",
              },
              "productBrand": "",
              "productDetails": "This is a simple, virtual product.",
              "productId": "product-id",
              "productImages": [
                {
                  "alt": "",
                  "url": "product-image-url",
                },
              ],
              "productPrice": 15,
              "productPriceCurrency": "USD",
              "productTitle": "Album",
              "productUrl": "http://localhost:8899/product/album",
            },
            {
              "aggregateRating": {
                "ratingValue": 0,
                "reviewCount": 0,
                "reviewUrl": "http://localhost:8899/product/sunglasses",
              },
              "productBrand": "",
              "productDetails": "This is a simple product.",
              "productId": "product-id",
              "productImages": [
                {
                  "alt": "",
                  "url": "product-image-url",
                },
              ],
              "productPrice": 90,
              "productPriceCurrency": "USD",
              "productTitle": "Sunglasses",
              "productUrl": "http://localhost:8899/product/sunglasses",
            },
          ]
        `);
      });
    });
  });
});
