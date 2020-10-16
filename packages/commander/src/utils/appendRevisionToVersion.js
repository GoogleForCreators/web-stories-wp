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
 * Appends the current revision to the version number for nightly builds.
 *
 * Follows semantic versioning guidelines to denote build metadata by
 * appending a plus sign.
 *
 * @see https://semver.org/
 *
 * @param {string} version Version number.
 * @return {string} Modified version.
 */
function appendRevisionToVersion(version) {
  // Get the current commit hash. Used for pre-releases.
  // GITHUB_SHA is available during the GitHub Actions workflow.
  const currentCommitHash = process.env.GITHUB_SHA
    ? process.env.GITHUB_SHA.slice(0, 7)
    : execSync('git rev-parse --short=7 HEAD').toString().trim();

  return `${version}+${currentCommitHash}`;
}

export default appendRevisionToVersion;
