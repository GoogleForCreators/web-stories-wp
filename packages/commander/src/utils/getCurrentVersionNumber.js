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
import { readFileSync } from 'fs';

const VERSION_REGEX = /\* Version:(.+)/;
const VERSION_CONSTANT_REGEX = /define\(\s*'WEBSTORIES_VERSION',\s*'([^']*)'\s*\);/;

/**
 * Returns the current version number as found in the main plugin file's header.
 *
 * @param {string} pluginFile Path to the main plugin file.
 * @param {boolean} constant Whether to extract the version from the WEBSTORIES_VERSION constant instead.
 * @return {string} Version number
 */
function getCurrentVersionNumber(pluginFile, constant = false) {
  const pluginFileContent = readFileSync(pluginFile, 'utf8');

  if (!constant) {
    return pluginFileContent.match(VERSION_REGEX)[1].trim();
  }

  return pluginFileContent.match(VERSION_CONSTANT_REGEX)[1].trim();
}

export default getCurrentVersionNumber;
