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
import { dirname, basename, join } from 'path';
import { execFileSync } from 'child_process';
import { existsSync, unlinkSync } from 'fs';

/**
 * Generates a ZIP file.
 *
 * Ensures the folder in the final ZIP file is always named "web-stories".
 *
 * @param {string} source Full path to the directory that should be zipped.
 * @param {string} zipName Desired file name.
 */
function generateZipFile(source, zipName) {
  const cwd = dirname(source); // /full/path/to/build
  const fullPath = join(source, zipName);

  if (existsSync(fullPath)) {
    unlinkSync(fullPath);
  }

  const args = ['-rT', zipName, basename(source)];
  execFileSync('zip', args, {
    cwd,
    stdio: ['pipe', 'pipe', 'ignore'],
  });
}

export default generateZipFile;
