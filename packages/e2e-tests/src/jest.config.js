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
 * Environment variables
 */
const {
  WP_USERNAME = 'admin',
  WP_PASSWORD = 'password',
  WP_BASE_URL = 'http://localhost:8899',
} = process.env;

// Explicitly set these environment variables if not already there.
process.env.WP_USERNAME = WP_USERNAME;
process.env.WP_PASSWORD = WP_PASSWORD;
process.env.WP_BASE_URL = WP_BASE_URL;

export default {
  rootDir: '../../../',
  resolver: '@web-stories-wp/jest-resolver',
  preset: 'jest-puppeteer',
  testMatch: ['**/specs/**/*.[jt]s', '**/?(*.)spec.[jt]s'],
  testPathIgnorePatterns: [
    '<rootDir>/.git',
    '<rootDir>/build',
    '<rootDir>/node_modules',
    '<rootDir>/vendor',
  ],
  transformIgnorePatterns: ['node_modules'],
  setupFilesAfterEnv: [
    'jest-extended/all',
    '<rootDir>/packages/e2e-tests/src/config/bootstrap.js',
    '@wordpress/jest-puppeteer-axe',
    '@wordpress/jest-console',
    'expect-puppeteer',
  ],
  modulePathIgnorePatterns: ['<rootDir>/build', '<rootDir>/vendor'],
  reporters: [['jest-silent-reporter', { useDots: true, showWarnings: true }]],
};
