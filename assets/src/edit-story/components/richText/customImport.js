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
import { weightToStyle, ITALIC, UNDERLINE } from './customConstants';
import { draftMarkupToContent } from './util';

function customInlineFn(element, { Style }) {
  switch (element.tagName.toLowerCase()) {
    case 'span': {
      const styles = [...element.classList]
        .map((className) => {
          switch (className) {
            case 'weight': {
              const fontWeight = parseInt(element.style.fontWeight) || 400;
              return weightToStyle(fontWeight);
            }

            case 'italic':
              return ITALIC;

            case 'underline':
              return UNDERLINE;

            default:
              return null;
          }
        })
        .filter((style) => Boolean(style));

      if (styles.length) {
        // This is the reason we need a fork, as multiple styles aren't supported by published package
        // and maintainer clearly doesn't care about it enough to merge.
        return Style(styles[0]);
      }

      return null;
    }

    default:
      return null;
  }
}

function importHTML(html) {
  const htmlWithBreaks = (html || '')
    // Re-insert manual line-breaks for empty lines
    .replace(/\n(?=\n)/g, '\n<br />')
    .split('\n')
    .map((s) => {
      return `<p>${draftMarkupToContent(s)}</p>`;
    })
    .join('');
  return stateFromHTML(htmlWithBreaks, { customInlineFn });
}

export default importHTML;
