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
import { dirname } from 'path';

/**
 * Internal dependencies
 */
import generateZipFile from './generateZipFile.js';
import deleteExistingZipFiles from './deleteExistingZipFiles.js';
import getCurrentVersionNumber from './getCurrentVersionNumber.js';

/**
 * Main function to bundle the plugin.
 *
 * @param {string} source Path to the source directory.
 * @param {boolean} [composer=false] Create Composer-ready ZIP file without PHP autoloader.
 * @param {string|boolean} zip Whether a ZIP file should be generated. Pass a string to set a custom file name.
 * @param {boolean} [clean] Whether to delete existing ZIP file.
 * @return {string} Path to the build directory or ZIP file.
 */
function bundlePlugin(source, composer = false, zip = true, clean = false) {
  const pluginFile = `${source}/web-stories.php`;

  if (clean) {
    deleteExistingZipFiles(dirname(source));
  }

  const currentVersion = getCurrentVersionNumber(pluginFile, true);
  const defaultZipName = !composer
    ? `web-stories-${currentVersion}.zip`
    : `web-stories-${currentVersion}-composer.zip`;
  const zipName = zip === true ? defaultZipName : zip;
  generateZipFile(source, zipName);
  return `${dirname(source)}/${zipName}`;
}

export default bundlePlugin;
