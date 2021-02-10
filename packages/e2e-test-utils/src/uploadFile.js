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
import { join, extname, resolve } from 'path';
import { tmpdir } from 'os';
import { copyFileSync } from 'fs';
import { v4 as uuid } from 'uuid';

/**
 * Uploads a file to the Media Library, and awaits its upload.
 *
 * The file should reside in packages/e2e-tests/src/assets/.
 *
 * @param {string|null} file The file name to upload, for example 'foo.mp4'.
 * @param {boolean} checkUpload Check upload was successfully.
 * @return {string|null} The name of the file as it was uploaded.
 */
async function uploadFile(file, checkUpload = true) {
  const fileExtension = extname(file);
  await page.setDefaultTimeout(10000);

  const testMediaPath = resolve(
    process.cwd(),
    `packages/e2e-tests/src/assets/${file}`
  );

  // Copy file to <newname>.ext for upload.
  const newBaseName = uuid();
  const newFileName = newBaseName + fileExtension;
  const tmpFileName = join(tmpdir(), newFileName);
  copyFileSync(testMediaPath, tmpFileName);

  // Wait for media modal to appear and upload file.
  await expect(page).toUploadFile('.media-modal input[type=file]', tmpFileName);

  await expect(page).not.toMatchElement('.media-modal .upload-error');

  // Upload successful!
  if (checkUpload) {
    await page.waitForSelector(`.media-modal li[aria-label="${newBaseName}"]`);
  }
  await page.setDefaultTimeout(3000);

  return newFileName;
}

export default uploadFile;
