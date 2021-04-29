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

const getFileName = (name) => name.split('.').slice(0, -1).join('.');

/**
 * Helper that upload a publisher logo in the dashboard settings.
 *
 * @param {string}file Filename
 *
 * @return {Promise<string>} Return the filename.
 */
async function uploadPublisherLogo(file) {
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

  return newBaseName;
}

export default uploadPublisherLogo;
