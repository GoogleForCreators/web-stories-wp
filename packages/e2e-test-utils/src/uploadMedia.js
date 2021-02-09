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
import { uploadFile } from './';

const MODAL = '.media-modal';

/**
 * Helper that upload a file in the media dialog in the stories editor.
 *
 * @param {string}file Filename
 * @param {boolean}exit If this helper should exit the dialog.
 *
 * @return {Promise<string>} Return the filename without ext.
 */
async function uploadMedia(file, exit = true) {
  // Clicking will only act on the first element.
  await expect(page).toClick('button', { text: 'Upload' });

  await page.waitForSelector(MODAL, {
    visible: true,
  });

  const fileName = await uploadFile(file);
  const fileNameNoExt = fileName.replace(/\.[^/.]+$/, '');

  await expect(page).toMatchElement(
    `.attachments-browser .attachments .attachment[aria-label="${fileNameNoExt}"]`
  );

  if (exit) {
    await page.keyboard.press('Escape');

    await page.waitForSelector(MODAL, {
      visible: false,
    });
  }

  return fileNameNoExt;
}

export default uploadMedia;
