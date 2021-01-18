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
  await Promise.all([
    expect(page).toClick('a', { text: fileName, exact_text: true }),
    page.waitForNavigation(),
  ]);
  await Promise.all([
    page.waitForSelector(`#delete-action a`),
    expect(page).toClick(`#delete-action a`),
    page.waitForNavigation(),
  ]);
  await page.waitForSelector(`#message`);
  await expect(page).toMatch('Media file permanently deleted.');
}

export default deleteMedia;
