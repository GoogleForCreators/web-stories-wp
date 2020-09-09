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

const ASSETS_URL_CONSTANT_REGEX = /define\(\s*'WEBSTORIES_ASSETS_URL',\s*([^)]*?)\s*\);/;

/**
 * Updates the assets URL.
 *
 * Used for loading assets from a CDN.
 *
 * @param {string} pluginFile Path to the plugin file.
 * @param {string} [cdn] CDN URL to use instead of the default.
 */
function updateAssetsURL(pluginFile, cdn) {
  let pluginFileContent = readFileSync(pluginFile, 'utf8');
  const versionConstant = pluginFileContent.match(ASSETS_URL_CONSTANT_REGEX);

  writeFileSync(
    pluginFile,
    pluginFileContent.replace(
      versionConstant[0],
      `define( 'WEBSTORIES_ASSETS_URL', '${cdn}' );`
    )
  );
}

export default updateAssetsURL;
