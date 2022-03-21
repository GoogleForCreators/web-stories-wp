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

/**
 * Add a custom font on the settings page.
 *
 * @param {string} fontUrl Font URL.
 * @return {Promise<void>}
 */
export const addCustomFont = async (fontUrl) => {
  await visitSettings();
  await expect(page).toMatch('Custom Fonts');

  await expect(page).toClick('label', {
    text: 'Insert Font URL',
  });

  await page.keyboard.type(fontUrl);
  await expect(page).toClick('button', { text: 'Add Font' });
  // TODO(#10878): Target font by font name.
  await page.waitForSelector('[aria-label="Remove font"]');
};

/**
 * Remove a custom font from the settings page.
 *
 * @return {Promise<void>}
 */
export const removeCustomFont = async () => {
  await visitSettings();
  // TODO(#10878): Target font by font name.
  await page.hover('[aria-label="Remove font"]');
  await page.click('[aria-label="Remove font"]');
  await page.waitForSelector('[role="dialog"]');
  await expect(page).toClick('button', { text: 'Delete Font' });
};
