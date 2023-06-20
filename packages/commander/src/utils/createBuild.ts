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
 * Internal dependencies
 */
import copyFiles from './copyFiles';
import getIgnoredFiles from './getIgnoredFiles';

/**
 * Main function to bundle the plugin.
 *
 * @param source Path to the source directory.
 * @param target Path to target directory.
 * @param [composer] Create Composer-ready ZIP file without PHP autoloader.
 */
function createBuild(source: string, target: string, composer = false) {
  const ignoredFiles = getIgnoredFiles(source);

  if (composer) {
    ignoredFiles.push('includes/vendor/');
  } else {
    ignoredFiles.push('composer.json');
  }

  copyFiles(source, target, ignoredFiles);
}

export default createBuild;
