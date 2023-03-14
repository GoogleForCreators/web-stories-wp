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
 * Deletes an attachment with a given file name from the WordPress media library.
 *
 * @param {string} fileName File name with or without extension.
 */
async function deleteMedia(fileName) {
  await visitAdminPage('upload.php', 'mode=list');

  await expect(page).toMatchTextContent(fileName);

  // Make row actions appear.
  const elementId = await page.evaluate((name) => {
    let _id;
    document.querySelectorAll('p.filename').forEach((el) => {
      const currentFileName = el.textContent.replace('File name:', '').trim();
      if (currentFileName.startsWith(name)) {
        _id = el.closest('tr').id;
      }
    });
    return _id;
  }, fileName);

  await page.hover(`#${elementId}`);

  await Promise.all([
    await expect(page).toClick(`#${elementId} a.submitdelete`),
    page.waitForNavigation(),
  ]);
  await page.waitForSelector(`#message`);
  await expect(page).toMatchTextContent('Media file permanently deleted.');
}

export default deleteMedia;
