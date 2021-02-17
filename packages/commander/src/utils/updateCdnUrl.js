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

const CDN_BASE_URL = 'https://wp.stories.google/static/';
const CDN_URL_CONSTANT_REGEX = /define\(\s*'WEBSTORIES_CDN_URL',\s*'([^']*)'\s*\);/;

/**
 * Updates CDN URL in thhe main plugin file.
 *
 * Namely, this updates the `WEBSTORIES_CDN_URL` constant in the main plugin file.
 *
 * @param {string} pluginFile Path to the plugin file.
 * @param {string|number} version Desired version number. Either 'main' or an integer.
 * @return {void}
 */
function updateCdnURL(pluginFile, version) {
  let pluginFileContent = readFileSync(pluginFile, 'utf8');

  pluginFileContent = pluginFileContent.replace(CDN_URL_CONSTANT_REGEX, () => {
    return `define( 'WEBSTORIES_CDN_URL', '${CDN_BASE_URL}${version}' );`;
  });

  writeFileSync(pluginFile, pluginFileContent);
}

export default updateCdnURL;
