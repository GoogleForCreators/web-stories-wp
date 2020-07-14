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
import { execSync } from 'child_process';

/**
 * Internal dependencies
 */
import generateZipFile from './generateZipFile.js';
import copyFiles from './copyFiles.js';
import deleteExistingZipFiles from './deleteExistingZipFiles.js';
import getCurrentVersionNumber from './getCurrentVersionNumber.js';
import getIgnoredFiles from './getIgnoredFiles.js';

const composerArgs =
  '--optimize-autoloader --no-interaction --prefer-dist --no-suggest --quiet';

/**
 * Main function to bundle the plugin.
 *
 * @param {string} source Path to the source directory.
 * @param {boolean} [composer=false] Create Composer-ready ZIP file without PHP autoloader.
 * @param {string|boolean} zip Whether a ZIP file should be generated. Pass a string to set a custom file name.
 * @param {boolean} [clean] Whether to delete existing ZIP file.
 * @param {boolean} [cdn] Whether to use a CDN for assets or not.
 * @return {string} Path to the build directory or ZIP file.
 */
function bundlePlugin(
  source,
  composer = false,
  zip = false,
  clean = false,
  cdn = false
) {
  const pluginFile = `${source}/web-stories.php`;
  const buildDir = source + '/build';
  const pluginBuildDir = buildDir + '/web-stories';
  const pluginBuildDirPath = 'build/web-stories';

  if (!composer) {
    execSync(`composer update --no-dev ${composerArgs}`);
  }

  const ignoredFiles = getIgnoredFiles(source);
  if (composer) {
    ignoredFiles.push('vendor/');
  }
  if (cdn) {
    ignoredFiles.push('assets/images/templates/');
  }
  copyFiles(source, pluginBuildDirPath, ignoredFiles);

  if (!composer) {
    execSync(
      `composer update ${composerArgs}; git checkout composer.lock --quiet; composer install ${composerArgs}`
    );
  }

  if (zip) {
    if (clean) {
      deleteExistingZipFiles(buildDir);
    }

    const currentVersion = getCurrentVersionNumber(pluginFile, true);
    const defaultZipName = !composer
      ? `web-stories-${currentVersion}.zip`
      : `web-stories-${currentVersion}-composer.zip`;
    const zipName = zip === true ? defaultZipName : zip;
    generateZipFile(pluginBuildDir, zipName);
    return `${pluginBuildDirPath}/${zipName}`;
  }

  return pluginBuildDirPath;
}

export default bundlePlugin;
