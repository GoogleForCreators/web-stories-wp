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
 * External dependencies
 */
import { join, resolve } from 'path';
import { tmpdir } from 'os';
import { copyFileSync } from 'fs';

/**
 * Uploads a file to the Media Library, and awaits its upload.
 *
 * The file should reside in packages/e2e-tests/src/assets/.
 *
 * @param {string|null} file The file name to upload, for example 'foo.mp4'.
 * @param {boolean} checkUpload Whether to check if upload was successful.
 * @return {string|null} The name of the file as it was uploaded.
 */
async function uploadFile(file, checkUpload = true) {
  await page.setDefaultTimeout(10000);

  const testMediaPath = resolve(
    process.cwd(),
    `packages/e2e-tests/src/assets/${file}`
  );

  // Prefixing makes it easier to identify files from tests later on.
  const tmpFileName = join(tmpdir(), `e2e-${file}`);
  copyFileSync(testMediaPath, tmpFileName);

  // Wait for media modal to appear and upload file.
  await expect(page).toUploadFile('.media-modal input[type=file]', tmpFileName);

  await page.waitForSelector('.media-uploader-status:not(.uploading)');
  await page.waitForSelector('.button.media-button-select:not([disabled])');
  await expect(page).not.toMatchElement('.media-modal .upload-error');

  const fileNameEl = await page.waitForSelector(
    '.media-modal-content .attachment-details .filename'
  );
  const newFileName = await fileNameEl.evaluate((el) => el.textContent);

  if (checkUpload) {
    const attachmentTitleEl = await page.waitForSelector(
      '#attachment-details-title'
    );
    const attachmentTitle = await attachmentTitleEl.evaluate((el) => el.value);
    const escapedTitle = attachmentTitle.replace(/"/g, '\\"');
    await page.waitForSelector(
      `.attachments-browser .attachments .attachment[aria-label="${escapedTitle}"]`
    );
  }
  await page.setDefaultTimeout(3000);

  return newFileName;
}

export default uploadFile;
