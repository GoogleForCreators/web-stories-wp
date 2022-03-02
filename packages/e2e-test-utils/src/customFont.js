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

export const addCustomFont = async (
  font = 'OpenSansCondensed-Light.ttf',
  addBaseUrl = true
) => {
  await visitSettings();
  await page.waitForSelector('#insertFontUrl');

  if (addBaseUrl) {
    font = `${process.env.WP_BASE_URL}/wp-content/e2e-assets/${font}`;
  }

  await expect(page).toClick('label', {
    text: 'Insert Font URL',
  });

  await page.keyboard.type(font);
  await expect(page).toClick('button', { text: 'Add Font' });
  await page.waitForSelector('[aria-label="Remove font"]');
};

export const removeCustomFont = async () => {
  await visitSettings();
  await page.hover('[aria-label="Remove font"]');
  await page.click('[aria-label="Remove font"]');
  await page.waitForSelector('[role="dialog"]');
  await expect(page).toClick('button', { text: 'Delete Font' });
};
