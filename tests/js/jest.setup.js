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

// Extend Jest matchers.
// See https://github.com/testing-library/jest-dom.
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';

// Improve snapshot testing for styled components.
// Also provides a `toHaveStyleRule()` matcher.
import 'jest-styled-components';

import {
  toBeValidAMP,
  toBeValidAMPStoryElement,
  toBeValidAMPStoryPage,
} from '@web-stories-wp/jest-amp';

// eslint-disable-next-line jest/require-hook
expect.extend({
  toBeValidAMP,
  toBeValidAMPStoryElement,
  toBeValidAMPStoryPage,
});

// Retry flaky tests  on CI.
if ('true' === process.env.CI) {
  jest.retryTimes(2);
}
