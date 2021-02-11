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
import { visitAdminPage } from '@wordpress/e2e-test-utils';

/**
 * Creates a new story.
 *
 * @param {string}fileName File name to delete with ext.
 */
async function deleteMedia(fileName) {
  await visitAdminPage('upload.php', 'mode=list');

  await expect(page).toMatch(fileName);

  // Make row actions appear.
  const elmId = await page.evaluate((filename) => {
    return document
      .querySelector(`a[aria-label="“${filename}” (Edit)"]`)
      .closest('tr').id;
  }, fileName);

  await page.hover(`#${elmId}`);

  await Promise.all([
    await expect(page).toClick(
      `a[aria-label="Delete “${fileName}” permanently"]`
    ),
    page.waitForNavigation(),
  ]);
  await page.waitForSelector(`#message`);
  await expect(page).toMatch('Media file permanently deleted.');
}

export default deleteMedia;
