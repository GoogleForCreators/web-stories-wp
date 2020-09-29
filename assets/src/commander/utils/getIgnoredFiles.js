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
import { existsSync, lstatSync, readFileSync } from 'fs';

/**
 * Returns a list of files that should be ignored based on the .distignore file.
 *
 * @param {string} source Path to the plugin root folder where the .distignore file is expected.
 * @return {string[]} List of files.
 */
function getIgnoredFiles(source) {
  const distignore = source + '/.distignore';

  if (!existsSync(distignore)) {
    return [];
  }

  const maybeIgnoredFiles = readFileSync(distignore, 'utf8').split('\n');
  const ignoredFiles = [];

  for (const line of maybeIgnoredFiles) {
    const file = line.trim();

    if (file === '') {
      continue;
    }

    if (file.startsWith('#')) {
      continue;
    }

    const fileFromRoot = `${source}/${file}`;

    if (!existsSync(fileFromRoot)) {
      continue;
    }

    if (lstatSync(fileFromRoot).isDirectory()) {
      ignoredFiles.push(`${file}/`);
    } else {
      ignoredFiles.push(file);
    }
  }

  return ignoredFiles;
}

export default getIgnoredFiles;
