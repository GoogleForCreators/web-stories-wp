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

process.env.WP_BASE_URL = process.env.WP_BASE_URL || 'http://localhost:8899';

export default {
  preset: 'jest-puppeteer',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  testMatch: ['**/specs/**/*.[jt]s', '**/?(*.)spec.[jt]s'],
  testPathIgnorePatterns: [
    '<rootDir>/.git',
    '<rootDir>/node_modules',
    '<rootDir>/build',
    '<rootDir>/tests/e2e/specs/edit-story',
  ],
  transformIgnorePatterns: ['node_modules'],
  setupFilesAfterEnv: [
    '<rootDir>/config/bootstrap.js',
    '@wordpress/jest-puppeteer-axe',
    '@wordpress/jest-console',
    'expect-puppeteer',
  ],
  reporters: [['jest-silent-reporter', { useDots: true, showWarnings: true }]],
};
