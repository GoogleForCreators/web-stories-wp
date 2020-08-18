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
import { renderToStaticMarkup } from 'react-dom/server';

/**
 * Internal dependencies
 */
import {
  AmpStory,
  AmpStoryPage,
  AmpStoryGridLayer,
  getAMPValidationErrors,
} from './utils';

/** @typedef {import('react').ReactElement} ReactElement */
/** @typedef {import('jest').CustomMatcherResult} CustomMatcherResult */

/**
 * @param {string|ReactElement} stringOrComponent String containing HTML markup or a component.
 * @param {boolean} [optimize=true] Whether to use AMP Optimizer on the input string.
 * @return {CustomMatcherResult} Matcher result.
 */
async function toBeValidAMPStoryElement(stringOrComponent, optimize = true) {
  const string = renderToStaticMarkup(stringOrComponent);
  const errors = await getAMPValidationErrors(
    renderToStaticMarkup(
      <AmpStory>
        <AmpStoryPage>
          <AmpStoryGridLayer>{stringOrComponent}</AmpStoryGridLayer>
        </AmpStoryPage>
      </AmpStory>
    ),
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
