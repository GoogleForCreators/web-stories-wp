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
  publishStory,
  minWPVersionRequired,
  previewStory,
  withPlugin,
  insertProduct,
  setShoppingProvider,
} from '@web-stories-wp/e2e-test-utils';

/**
 * Internal dependencies
 */
import * as schema from './schema.json';

describe('Shopping', () => {
  withExperimentalFeatures(['shoppingIntegration']);
  minWPVersionRequired('5.8'); // WooCommerce requires WP 5.7+

  describe('WooCommerce', () => {
    withPlugin('woocommerce');

    beforeAll(async () => {
      await setShoppingProvider('WooCommerce');
    });

    describe('Schema Validation', () => {
      it('should match a valid schema', async () => {
        await createNewStory();
        await insertProduct('Hoodie with Zipper');
        await insertProduct('Album');
        await insertProduct('Sunglasses');

        await publishStory();
        const previewPage = await previewStory(page);
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

        expect(items).toHaveLength(3);
        items.forEach((item) => {
          expect(item).toMatchSchema(schema);
        });

        // Since WooCommerce product IDs can change between test runs / setups,
        // this changes them to something deterministic.
        const normalizedItems = items.map((item) => ({
          ...item,
          productId: 'product-id',
        }));

        expect(normalizedItems).toMatchInlineSnapshot(`
        Array [
          Object {
            "aggregateRating": Object {
              "ratingValue": 0,
              "reviewCount": 0,
              "reviewUrl": "http://localhost:8899/product/hoodie-with-zipper",
            },
            "productBrand": "",
            "productDetails": "This is a simple product.",
            "productId": "product-id",
            "productImages": Array [],
            "productPrice": 45,
            "productPriceCurrency": "USD",
            "productTitle": "Hoodie with Zipper",
            "productUrl": "http://localhost:8899/product/hoodie-with-zipper",
          },
          Object {
            "aggregateRating": Object {
              "ratingValue": 0,
              "reviewCount": 0,
              "reviewUrl": "http://localhost:8899/product/album",
            },
            "productBrand": "",
            "productDetails": "This is a simple, virtual product.",
            "productId": "product-id",
            "productImages": Array [],
            "productPrice": 15,
            "productPriceCurrency": "USD",
            "productTitle": "Album",
            "productUrl": "http://localhost:8899/product/album",
          },
          Object {
            "aggregateRating": Object {
              "ratingValue": 0,
              "reviewCount": 0,
              "reviewUrl": "http://localhost:8899/product/sunglasses",
            },
            "productBrand": "",
            "productDetails": "This is a simple product.",
            "productId": "product-id",
            "productImages": Array [],
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
