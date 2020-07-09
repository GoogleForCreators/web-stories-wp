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
import { getAMPValidationErrors } from './utils';

/** @typedef {import('react').ReactElement} ReactElement */
/** @typedef {import('jest').CustomMatcherResult} CustomMatcherResult */

/**
 * @param {string|ReactElement} stringOrComponent String or React component to test.
 * @param {Array} args Optional arguments to pass down.
 * @return {CustomMatcherResult} Matcher result.
 */
async function toBeValidAMP(stringOrComponent, ...args) {
  const string = renderToStaticMarkup(stringOrComponent);
  const errors = await getAMPValidationErrors(string, ...args);
  const pass = errors.length === 0;

  return {
    pass,
    message: () =>
      pass
        ? `Expected ${string} not to be valid AMP.`
        : `Expected ${string} to be valid AMP. Errors:\n${errors.join('\n')}`,
  };
}

export default toBeValidAMP;
