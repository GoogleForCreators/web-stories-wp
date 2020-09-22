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
import { stateFromHTML } from 'draft-js-import-html';

/**
 * Internal dependencies
 */
import getValidHTML from '../../utils/getValidHTML';
import formatters from './formatters';

function customInlineFn(element, { Style }) {
  const styleStrings = formatters
    .map(({ elementToStyle }) => elementToStyle(element))
    .filter((style) => Boolean(style));

  if (styleStrings.length === 0) {
    return null;
  }

  return Style(styleStrings);
}

function importHTML(html = '') {
  const htmlWithBreaks = html
    .split('\n')
    .map((s) => `<p>${getValidHTML(s === '' ? '<br />' : s)}</p>`)
    .join('');

  return stateFromHTML(htmlWithBreaks, { customInlineFn });
}

export default importHTML;
