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
 * Internal dependencies
 */
import { getAMPValidationErrors } from './utils';

/** @typedef {import('jest').CustomMatcherResult} CustomMatcherResult */

/**
 * @param {string} string String containing HTML markup.
 * @param {boolean} [optimize=true] Whether to use AMP Optimizer on the input string.
 * @return {CustomMatcherResult} Matcher result.
 */
async function toBeValidAMPStoryElement(string, optimize = true) {
  const errors = await getAMPValidationErrors(
    `<amp-story
      standalone="standalone"
      publisher="Example Publisher"
      publisher-logo-src="https://example.com/publisher.png"
      title="Example Story"
      poster-portrait-src="https://example.com/poster.png"
    >
      <amp-story-page id="foo">
        <amp-story-grid-layer template="vertical">
          ${string}
        </amp-story-grid-layer>
      </amp-story-page>
    </amp-story>`,
    optimize
  );

  const pass = errors.length === 0;

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${string} not to be valid AMP.`
        : `Expected ${string} to be valid AMP. Errors:\n${errors.join('\n')}`,
  };
}

export default toBeValidAMPStoryElement;
