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

// RegExp explanation for /(?<!.+\n*)\n|(?<=.+\n)\n+/g
// Match any new lines that have no characters preceding it with the exception of a newline
// OR match any new line that proceeds characters and a single new line
//
// (?<!.+\n*)\n
// Negative lookbehind to match any new lines that DON'T have characters
// and 0 or more new lines preceeding it. This covers new lines that come before
// any text and should all be converted to <br /> tags
//
// (?<=.+\n)\n+
// Positive lookbehind to match any new lines that come after characters and a single new line
// This covers empty lines that should be placed between text.

const re = new RegExp(/(?<!.+\n*)\n|(?<=.+\n)\n+/g);

function importHTML(html = '') {
  const separator = `__${Date.now()}__`;

  const htmlWithBreaks = html
    .replace(re, `${separator}<br />${separator}`)
    .split(separator)
    .filter(Boolean)
    .map((s) => `<p>${getValidHTML(s)}</p>`)
    .join('');

  return stateFromHTML(htmlWithBreaks, { customInlineFn });
}

export default importHTML;
