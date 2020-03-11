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

module.exports = {
  rootDir: '../../',
  ...require('@wordpress/scripts/config/jest-unit.config'),
  transform: {
    '^.+\\.[jt]sx?$':
      '<rootDir>/node_modules/@wordpress/scripts/config/babel-transform',
  },
  moduleNameMapper: {
    '\\.svg': '<rootDir>/__mocks__/svgrMock.js',
  },
  setupFiles: [
    '<rootDir>/tests/js/setup-globals',
    '<rootDir>/tests/js/setup-mocks',
    'jest-canvas-mock',
  ],
  testMatch: [
    '**/__tests__/**/*.[jt]s',
    '**/test/**/*.[jt]s',
    '**/?(*.)test.[jt]s',
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/js/jest.setup'],
  testPathIgnorePatterns: [
    '<rootDir>/.git',
    '<rootDir>/node_modules',
    '<rootDir>/build',
    '_utils',
  ],
  coveragePathIgnorePatterns: ['/node_modules/', '<rootDir>/build/'],
  coverageReporters: ['lcov'],
  coverageDirectory: '<rootDir>/build/logs',
  collectCoverageFrom: [
    '<rootDir>/assets/src/edit-story/**/*.js',
    '!**/test/**',
    '!**/stories/**',
  ],
  reporters: [['jest-silent-reporter', { useDots: true, showWarnings: true }]],
};
