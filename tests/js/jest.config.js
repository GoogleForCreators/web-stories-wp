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
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  rootDir: '../../',
  moduleNameMapper: {
    '\\.svg': join(__dirname, '/svgrMock.js'),
    '\\.css': join(__dirname, '/styleMock.js'),
    '\\.png': join(__dirname, '/imageMock.js'),
  },
  setupFiles: [
    '<rootDir>/tests/js/setup-globals',
    '<rootDir>/tests/js/setup-mocks',
    'jest-canvas-mock',
    'core-js',
  ],
  testEnvironment: 'jsdom',
  testMatch: [
    '**/__tests__/**/*.[jt]s',
    '**/test/**/*.[jt]s',
    '**/?(*.)test.[jt]s',
  ],
  setupFilesAfterEnv: ['jest-extended/all', '<rootDir>/tests/js/jest.setup'],
  testPathIgnorePatterns: [
    '<rootDir>/.git',
    '<rootDir>/build',
    '<rootDir>/node_modules',
    '<rootDir>/vendor',
    'testUtils',
    '_utils',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/build',
    'testUtils',
    '_utils',
    'types.js',
  ],
  coverageReporters: ['lcov'],
  coverageDirectory: '<rootDir>/build/logs',
  collectCoverageFrom: [
    '<rootDir>/assets/src/**/*.js',
    '<rootDir>/bin/**/*.js',
    '!**/karma/**',
    '!**/test/**',
    '!**/stories/**',
  ],
  modulePathIgnorePatterns: ['<rootDir>/build', '<rootDir>/vendor'],
  reporters: [
    [
      'jest-silent-reporter',
      { useDots: true, showWarnings: true, showPaths: true },
    ],
  ],
};
