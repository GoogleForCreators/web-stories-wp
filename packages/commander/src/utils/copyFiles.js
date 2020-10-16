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
import { execFileSync } from 'child_process';

/**
 * Copies all files minuses ignored ones from source to target directory.
 *
 * @param {string} source Path to source directory.
 * @param {string} target Path to target directory.
 * @param {Array<string>} ignoredFiles List of ignored files.
 */
function copyFiles(source, target, ignoredFiles) {
  const excludeList = ignoredFiles.reduce((acc, file) => {
    acc.push('--exclude');
    acc.push(file);
    return acc;
  }, []);

  // Copy plugin folder to temporary location.
  const args = ['-a', ...excludeList, `${source}/`, `${target}/`];
  execFileSync('rsync', args, {
    stdio: ['pipe', 'pipe', 'ignore'],
  });
}

export default copyFiles;
