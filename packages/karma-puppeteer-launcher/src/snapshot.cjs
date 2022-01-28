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
const percySnapshot = require('@percy/puppeteer');

/**
 * @param {Object} frame Frame.
 * @param {string} testName Test name.
 * @param {string} snapshotName Snapshot name.
 * @param {Object} options Additional options to pass through
 */
async function takePercySnapshot(
  frame,
  testName,
  snapshotName,
  options = {}
) {
  if (!testName) {
    testName = '_';
  }
  testName = testName.trim();
  if (!snapshotName) {
    snapshotName = 'default';
  }
  snapshotName = snapshotName.trim();

  await percySnapshot(frame, `${testName}: ${snapshotName}`, options);
}

module.exports = takePercySnapshot;
