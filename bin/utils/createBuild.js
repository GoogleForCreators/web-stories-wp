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
import copyFiles from './copyFiles.js';
import getIgnoredFiles from './getIgnoredFiles.js';

const composerArgs =
  '--optimize-autoloader --no-interaction --prefer-dist --no-suggest --quiet';

/**
 * Main function to bundle the plugin.
 *
 * @param {string} source Path to the source directory.
 * @param {string} target Path to target directory.
 * @param {boolean} [composer=false] Create Composer-ready ZIP file without PHP autoloader.
 */
function createBuild(source, target, composer = false) {
  if (!composer) {
    execSync(`composer update --no-dev ${composerArgs}`);
  }

  const ignoredFiles = getIgnoredFiles(source);
  if (composer) {
    ignoredFiles.push('vendor/');
  } else {
    ignoredFiles.push('composer.json');
  }
  copyFiles(source, target, ignoredFiles);

  if (!composer) {
    execSync(
      `composer update ${composerArgs}; git checkout composer.lock --quiet; composer install ${composerArgs}`
    );
  }
}

export default createBuild;
