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

/** @type {import('@jest/types').Config} */
const sharedConfig = {
  rootDir: '.',
  resolver: '@web-stories-wp/jest-resolver',
  moduleNameMapper: {
    '\\.svg': join(__dirname, '/svgrMock.js'),
    '\\.css': join(__dirname, '/styleMock.js'),
    '\\.png': join(__dirname, '/imageMock.js'),
  },
  setupFiles: ['core-js'],
  // Do not transform any node_modules except use-reduction
  // See https://jestjs.io/docs/configuration#transformignorepatterns-arraystring
  transformIgnorePatterns: ['/node_modules/(?!(use-reduction|lib0|parsel-js)/)'],
  testEnvironment: 'jsdom',
  testMatch: ['**/test/**/*.{js,jsx,ts,tsx}'],
  globals: {
    WEB_STORIES_ENV: 'development',
    WEB_STORIES_DISABLE_ERROR_BOUNDARIES: true,
    WEB_STORIES_DISABLE_OPTIMIZED_RENDERING: true,
    WEB_STORIES_DISABLE_PREVENT: true,
    WEB_STORIES_DISABLE_QUICK_TIPS: true,
  },
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
    'rollup.config.js',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/build',
    '<rootDir>/vendor',
    '/dist-types/',
  ],
};

export default {
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
  reporters: [
    [
      'jest-silent-reporter',
      { useDots: true, showWarnings: true, showPaths: true },
    ],
  ],
  projects: [
    {
      ...sharedConfig,
      displayName: 'Core (jsdom)',
      transform: {
        '^.+\\.[jt]sx?$': 'babel-jest',
      },
      setupFiles: [
        ...sharedConfig.setupFiles,
        '<rootDir>/tests/js/setup-globals',
        '<rootDir>/tests/js/setup-mocks',
        'jest-canvas-mock',
      ],
      testMatch: ['<rootDir>/packages/**/test/**/*.{js,jsx,ts,tsx}'],
      testPathIgnorePatterns: [
        ...sharedConfig.testPathIgnorePatterns,
        '<rootDir>/packages/*/scripts',
        '<rootDir>/packages/activation-notice',
        '<rootDir>/packages/stories-block',
        '<rootDir>/packages/tinymce-button',
        '<rootDir>/packages/widget',
        '<rootDir>/packages/e2e-test-utils',
        '<rootDir>/packages/e2e-tests',
      ],
    },
    {
      ...sharedConfig,
      displayName: 'Core (node)',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/packages/*/scripts/**/test/**/*.{js,ts}'],
    },
    {
      ...sharedConfig,
      displayName: 'WP (jsdom)',
      transform: {
        '^.+\\.[jt]sx?$': 'babel-jest',
      },
      setupFiles: [
        ...sharedConfig.setupFiles,
        '<rootDir>/tests/js/setup-globals',
      ],
      moduleNameMapper: {
        ...sharedConfig.moduleNameMapper,
        // Hacky way to grab a version of React 18 we know is installed.
        '^react$':
          '<rootDir>/packages/stories-block/node_modules/react/index.js',
        '^react-dom(/.*)$':
          '<rootDir>/packages/stories-block/node_modules/react-dom/$1',
      },
      testMatch: [
        '<rootDir>/packages/activation-notice/**/test/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/packages/stories-block/**/test/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/packages/tinymce-button/**/test/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/packages/widget/**/test/**/*.{js,jsx,ts,tsx}',
      ],
    },
    {
      ...sharedConfig,
      displayName: 'WP (node)',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/packages/commander/**/test/**/*.[jt]s'],
    },
  ],
};
