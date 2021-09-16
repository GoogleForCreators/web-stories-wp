/*
 * Copyright 2021 Google LLC
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

export function skipSuiteOnFirefox() {
  if (process.env.PUPPETEER_PRODUCT === 'firefox') {
    test.only('does not work on Firefox', () => {});
  }
}

/**
 * Simple version comparison check.
 *
 * Used to determine whether the first version is equal or higher
 * than the second.
 *
 * @param {string} a First version to compare.
 * @param {string} b Second version to compare.
 * @return {boolean} Whether the first version >= the second.
 */
function versionCompare(a, b) {
  const aParts = a.split('.').map((e) => Number(e));
  const bParts = b.split('.').map((e) => Number(e));

  for (const i of Object.keys(aParts)) {
    bParts[i] = bParts[i] || 0;
    if (aParts[i] === bParts[i]) {
      continue;
    }

    return aParts[i] > bParts[i];
  }
  return !(bParts.length > aParts.length);
}

/**
 * Check minimum version of WordPress.
 *
 * @param {string} minVersion Minimum require WordPress version.
 */
export function minWPVersionRequired(minVersion) {
  const WPVersion = process.env?.WP_VERSION;
  if ('latest' !== WPVersion && !versionCompare(WPVersion, minVersion)) {
    test.only('minimum WordPress requirement not met', () => {});
  }
}
