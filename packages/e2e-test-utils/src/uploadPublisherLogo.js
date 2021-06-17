/*
 * Copyright 2021 Google LLC
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
 * Internal dependencies
 */
import getFileName from './getFileName';

/**
 * Helper that upload a publisher logo in the dashboard settings.
 *
 * @param {string} file Filename
 * @param {boolean} checkUpload Check if upload was successful.
 * @return {Promise<string>} Return the filename.
 */
async function uploadPublisherLogo(file, checkUpload = true) {
  await page.setDefaultTimeout(10000);

  const testMediaPath = resolve(
    process.cwd(),
    `packages/e2e-tests/src/assets/${file}`
  );

  // Prefixing makes it easier to identify files from tests later on.
  const newFileName = `e2e-${file}`;
  const newBaseName = getFileName(newFileName);
  const tmpFileName = join(tmpdir(), newFileName);
  copyFileSync(testMediaPath, tmpFileName);

  await expect(page).toUploadFile('#settings_publisher_logos', tmpFileName);

  if (checkUpload) {
    await page.waitForSelector(
      `button[aria-label^="Publisher Logo ${newBaseName}"`
    );
  }

  await page.setDefaultTimeout(3000);

  return newBaseName;
}

export default uploadPublisherLogo;
