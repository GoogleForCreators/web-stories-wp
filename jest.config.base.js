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

const path = require('path');

module.exports = {
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  verbose: true,
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.svg': path.join(__dirname, '/tests/js/svgrMock.js'),
    '\\.css': path.join(__dirname, '/tests/js/styleMock.js'),
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s',
    '**/test/**/*.[jt]s',
    '**/?(*.)test.[jt]s',
  ],
  setupFiles: [path.join(__dirname, '/tests/js/setup-mocks.js')],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  testPathIgnorePatterns: [
    '<rootDir>/.git',
    '<rootDir>/node_modules',
    '<rootDir>/build',
    '_utils',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '<rootDir>/build/'],
  coverageReporters: ['lcov'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.js',
    '!**/test/**',
    '!**/stories/**',
  ],
  reporters: [['jest-silent-reporter', { useDots: true, showWarnings: true }]],
};
