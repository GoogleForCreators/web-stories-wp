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
 * Internal dependencies
 */
import visitSettings from './visitSettings';

async function clearSearch() {
  const hasText = await page.$eval(
    '[aria-label="Product search"]',
    (el) => el.value.length
  );
  if (hasText >= 1) {
    await expect(page).toClick('[aria-label="Clear product search"]');
  }
}

export const insertProduct = async (product, clickOnTab = true) => {
  if (clickOnTab) {
    // Switch to the Products tab and wait for initial list of products to be fetched.
    await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().includes('web-stories/v1/products') &&
          response.status() === 200
      ),
      expect(page).toClick('[aria-controls="library-pane-shopping"]'),
    ]);
  }

  await clearSearch();
  await page.waitForSelector('[aria-label="Product search"]');
  await page.focus('[aria-label="Product search"]');
  await page.type('[aria-label="Product search"]', product);

  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes('web-stories/v1/products') &&
        response.status() === 200
    ),
    await page.waitForSelector(`[aria-label="Add ${product}"]`),
  ]);

  expect(page).toClick(`[aria-label="Add ${product}"]`);

  await page.waitForTimeout(400);

  await page.waitForSelector(
    '[aria-label="Design menu"] [aria-label="Product"]',
    { text: product }
  );
};

export const setShoppingProvider = async (provider) => {
  await visitSettings();
  // Small trick to ensure we scroll to this input.
  const shoppingProviderDropdown = await page.$(
    'button[aria-label="Shopping provider"]'
  );
  await shoppingProviderDropdown.focus();

  await expect(page).toClick('button[aria-label="Shopping provider"]');

  await expect(page).toClick('[role="listbox"] li', {
    text: provider,
  });

  await expect(page).toMatchTextContent('Setting saved.');
};
