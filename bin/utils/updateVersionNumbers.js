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

/**
 * Internal dependencies
 */
import appendRevisionToVersion from './appendRevisionToVersion.js';

const VERSION_REGEX = /\* Version:(.+)/;
const VERSION_CONSTANT_REGEX = /define\(\s*'WEBSTORIES_VERSION',\s*'([^']*)'\s*\);/;
const STABLE_TAG_REGEX = /Stable tag:\s*(.+)/;

/**
 * Updates version numbers in plugin files.
 *
 * Namely, this updates the 'Version' header in the main plugin file,
 * the `WEBSTORIES_VERSION` constant in the same file, as well as the
 * stable tag in the readme.txt.
 *
 * If a specific version is provided, uses that version to update the constant.
 *
 * The stable tag is only updated if it's not a pre-release.
 *
 * @param {string} pluginFile Path to the plugin file.
 * @param {string} readmeFile Path to the readme file.
 * @param {string} version Desired version number.
 * @param {boolean} [nightly=false] Whether this is a nightly build or not.
 * @return {void}
 */
function updateVersionNumbers(
  pluginFile,
  readmeFile,
  version,
  nightly = false
) {
  let pluginFileContent = readFileSync(pluginFile, 'utf8');

  const isPrerelease = version.includes('-') || nightly;

  if (!isPrerelease) {
    // 'Version' plugin header must not include anything else beyond the version number,
    // i.e. no suffixes or similar.
    pluginFileContent = pluginFileContent.replace(
      VERSION_REGEX,
      `* Version: ${version}`
    );
  }

  const newVersion = nightly ? appendRevisionToVersion(version) : version;

  const versionConstant = pluginFileContent.match(VERSION_CONSTANT_REGEX);

  writeFileSync(
    pluginFile,
    pluginFileContent.replace(
      versionConstant[0],
      `define( 'WEBSTORIES_VERSION', '${newVersion}' );`
    )
  );

  // Update Stable tag in readme.txt if it's not a pre-release.
  if (!isPrerelease) {
    const readmeContent = readFileSync(readmeFile, 'utf8');
    writeFileSync(
      readmeFile,
      readmeContent.replace(
        STABLE_TAG_REGEX,
        `Stable tag:        ${newVersion}`
      )
    );
  }
}

export default updateVersionNumbers;
