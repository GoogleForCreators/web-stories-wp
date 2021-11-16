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
import uploadFile from './uploadFile';

/**
 * Helper that upload a file in the media dialog in the stories editor.
 *
 * @param {string} file Name of the file to upload.
 * @param {boolean} exit Whether to exit the media modal.
 * @return {Promise<string>} Uploaded file name.
 */
async function uploadPublisherLogoEditor(file, exit = true) {
  //open media uploader
  await expect(page).toClick('[aria-label="Poster image"]');

  await page.waitForSelector('.media-modal', {
    visible: true,
  });

  await expect(page).toClick('.media-modal #menu-item-upload', {
    text: 'Upload files',
    visible: true,
  });

  const fileName = await uploadFile(file, false);

  await expect(page).toClick('button', {
    text: 'Select as poster image',
    visible: true,
  });

  await expect(page).toClick('button', {
    text: 'Crop image',
    visible: true,
  });

  if (exit) {
    await page.keyboard.press('Escape');

    await page.waitForSelector('.media-modal', {
      visible: false,
    });
  }

  return fileName;
}

export default uploadPublisherLogoEditor;
