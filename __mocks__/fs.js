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

// see https://jestjs.io/docs/en/manual-mockshttps://jestjs.io/docs/en/manual-mocks

/**
 * External dependencies
 */
//eslint-disable-next-line no-undef -- TODO: Figure out why this is needed.
const path = require('path');

const fs = jest.createMockFromModule('fs');

/* eslint-disable security/detect-object-injection -- TODO: Figure out why this is needed. */

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockFiles = Object.create(null);
function __setMockFiles(newMockFiles) {
  mockFiles = Object.create(null);

  for (const [file, content] of Object.entries(newMockFiles)) {
    const dir = path.dirname(file);
    const basename = path.basename(file);

    if (!mockFiles[dir]) {
      mockFiles[dir] = [];
    }

    mockFiles[dir][basename] = content;
  }
}

function readdirSync(directoryPath) {
  return mockFiles[directoryPath] ? Object.keys(mockFiles[directoryPath]) : [];
}

function existsSync(dirOrFile) {
  const dirExists = Object.prototype.hasOwnProperty.call(mockFiles, dirOrFile);

  const dirname = path.dirname(dirOrFile);
  const fileExists =
    Object.prototype.hasOwnProperty.call(mockFiles, dirname) &&
    Object.prototype.hasOwnProperty.call(
      mockFiles[dirname],
      path.basename(dirOrFile)
    );

  return dirExists || fileExists;
}

function readFileSync(file) {
  const dir = path.dirname(file);
  return mockFiles[dir][path.basename(file)];
}

function writeFileSync(file, content) {
  const dir = path.dirname(file);
  if (!mockFiles[dir]) {
    mockFiles[dir] = [];
  }

  mockFiles[dir][path.basename(file)] = content;
}

function lstatSync(dirOrFile) {
  return {
    isDirectory: () =>
      Object.prototype.hasOwnProperty.call(mockFiles, dirOrFile),
  };
}

function rmdirSync(dirname) {
  if (Object.prototype.hasOwnProperty.call(mockFiles, dirname)) {
    delete mockFiles[dirname];
  }
}

function unlinkSync(file) {
  const dir = path.dirname(file);
  delete mockFiles[dir][path.basename(file)];
}

fs.__setMockFiles = __setMockFiles;
fs.readdirSync = readdirSync;
fs.readFileSync = readFileSync;
fs.writeFileSync = writeFileSync;
fs.existsSync = existsSync;
fs.lstatSync = lstatSync;
fs.rmdirSync = rmdirSync;
fs.unlinkSync = unlinkSync;

// eslint-disable-next-line no-undef -- TODO: Figure out why this is needed.
module.exports = fs;

/* eslint-enable security/detect-object-injection */
