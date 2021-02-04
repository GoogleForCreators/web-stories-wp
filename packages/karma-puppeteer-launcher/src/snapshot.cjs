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
const path = require('path');
const fs = require('fs').promises;

const STATES = ['active', 'focus', 'focus-within', 'hover'];

// E.g.: `/\:(hover|focus)\b/ig`.
const STATE_CSS_RE = new RegExp(`\\:(${STATES.join('|')})\\b`, 'ig');

/**
 * @param {Object} frame Frame.
 * @param {string} testName Test name.
 * @param {string} snapshotName Snapshot name.
 * @param {string} targetDir Destination path for snapshots.
 */
async function extractAndSaveSnapshot(
  frame,
  testName,
  snapshotName,
  targetDir
) {
  if (!testName) {
    testName = '_';
  }
  testName = testName.trim();
  if (!snapshotName) {
    snapshotName = 'default';
  }
  snapshotName = snapshotName.trim();

  const snapshot = await extractSnapshot(frame, testName, snapshotName);

  try {
    await fs.mkdir(targetDir, { recursive: true });
  } catch (e) {
    // Ignore. Let the file write fail instead.
  }

  // TODO: make "safe file name" rules better.
  const maxFileName = 240;
  let fileName = `${
    testName.length + snapshotName.length < maxFileName
      ? testName
      : testName.substring(0, Math.max(maxFileName - snapshotName.length, 0))
  }__${
    snapshotName.length < maxFileName
      ? snapshotName
      : snapshotName.substring(0, maxFileName)
  }`;
  fileName = fileName.replace(/[^a-z0-9]/gi, '_');
  const filePath = path.resolve(targetDir, fileName + '.html');
  await fs.writeFile(filePath, snapshot);
}

/**
 * @param {Object} frame Frame.
 * @param {string} testName Test name.
 * @param {string} snapshotName Snapshot name.
 * @return {string} Full HTML markup.
 */
async function extractSnapshot(frame, testName, snapshotName) {
  const { head, body } = await frame.evaluate((states) => {
    // Mark the existing states on the elements. E.g. `matches(':hover')`
    // becomes a `class="... karma-snapshot-hover"`.
    const cleanup = [];
    states.forEach((state) => {
      document.querySelectorAll(`:${state}`).forEach((element) => {
        const className = `karma-snapshot-${state}`;
        element.classList.add(className);
        cleanup.push(() => {
          element.classList.remove(className);
        });
      });
    });

    // TODO: more careful head selection.
    const result = {
      head: document.head.innerHTML,
      body: document.body.outerHTML,
    };

    // Cleanup: remove temporary state classes.
    cleanup.forEach((c) => c());

    return result;
  }, STATES);

  const transformHtml = (s) => {
    // Transform CSS states: `:hover` -> `.karma-snapshot-hover`.
    s = s.replace(STATE_CSS_RE, (_, state) => `.karma-snapshot-${state}`);
    // Transform absolute URLs.
    s = s.replace(/http:\/\/localhost:9876\//gi, '/');
    return s;
  };

  return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
      <title>${testName}: ${snapshotName}</title>
      <style>
        body {
          margin: 0;
          width: 100vw;
          height: 100vh;
        }
        .i__karma__snapshot__hide {
          display: none !important;
        }
      </style>
      ${transformHtml(head)}
    </head>
    ${transformHtml(body)}
    </html>
  `;
}

module.exports = extractAndSaveSnapshot;
