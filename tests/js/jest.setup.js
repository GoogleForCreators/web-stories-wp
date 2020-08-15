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
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { setDefaultOptions } from 'jsdom-screenshot';

// Extend Jest matchers.
// See https://github.com/testing-library/jest-dom.
import 'jest-extended';
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';

/**
 * Internal dependencies
 */
import toBeValidAMP from './matchers/toBeValidAMP';
import toBeValidAMPStoryElement from './matchers/toBeValidAMPStoryElement';
import toBeValidAMPStoryPage from './matchers/toBeValidAMPStoryPage';

expect.extend({
  toBeValidAMP,
  toBeValidAMPStoryElement,
  toBeValidAMPStoryPage,
  toMatchImageSnapshot,
});

// TravisCI and Linux OS require --no-sandbox to be able to run the tests
// https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-on-travis-ci
setDefaultOptions({
  launch: { args: process.env.CI === 'true' ? ['--no-sandbox'] : [] },
});
