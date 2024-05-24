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
 * Internal dependencies
 */
import visitAdminPage from './visitAdminPage';

/**
 * Deletes all manually uploaded attachments from the WordPress media library.
 */
async function deleteAllMedia() {
  await visitAdminPage('upload.php', 'mode=list');

  const itemsToDelete = await page.evaluate(() => {
    const items = [];
    document.querySelectorAll('p.filename').forEach((el) => {
      const currentFileName = el.textContent.replace('File name:', '').trim();
      if (currentFileName.includes('e2e-')) {
        items.push(el.closest('tr').id);
      }
    });
    return items;
  });

  /*eslint-disable no-await-in-loop*/
  for (const elementId of itemsToDelete) {
    // Make row actions appear.
    await page.hover(`#${elementId}`);

    await Promise.all([
      expect(page).toClick(`#${elementId} a.submitdelete`),
      page.waitForNavigation(),
    ]);
    await page.waitForSelector(`#message`);
    await expect(page).toMatchTextContent('Media file permanently deleted.');
  }
  /*eslint-enable no-await-in-loop*/
}

export default deleteAllMedia;
