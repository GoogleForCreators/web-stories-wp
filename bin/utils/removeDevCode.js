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
import { readFileSync, writeFileSync } from 'fs';

const DEV_CODE_REGEX = /\s*\/\/ WEB-STORIES-DEV-CODE[\s\S]*\/\/ WEB-STORIES-DEV-CODE\./;

/**
 * Removes dev code from a file.
 *
 * Removes everything between `WEB-STORIES-DEV-CODE` markers.
 *
 * @param {string} file Path to the file.
 */
function removeDevCode(file) {
  const fileContent = readFileSync(file, 'utf8');

  writeFileSync(file, fileContent.replace(DEV_CODE_REGEX, ''));
}

export default removeDevCode;
