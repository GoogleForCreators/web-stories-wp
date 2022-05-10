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
  resolver: '@web-stories-wp/jest-resolver',
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
  globals: {
    WEB_STORIES_ENV: 'development',
    WEB_STORIES_DISABLE_ERROR_BOUNDARIES: true,
    WEB_STORIES_DISABLE_OPTIMIZED_RENDERING: true,
    WEB_STORIES_DISABLE_PREVENT: true,
    WEB_STORIES_DISABLE_QUICK_TIPS: true,
  },
  setupFilesAfterEnv: [
    'jest-extended/all',
    '<rootDir>/tests/js/jest.setup',
    '@wordpress/jest-console',
  ],
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
    'rollup.config.js',
  ],
  coverageReporters: ['lcov'],
  coverageDirectory: '<rootDir>/build/logs',
  collectCoverageFrom: [
    '<rootDir>/packages/**/*.js',
    '<rootDir>/bin/**/*.js',
    '!<rootDir>/packages/fonts/**',
    '!**/karma/**',
    '!**/test/**',
    '!**/testUtils/**',
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
