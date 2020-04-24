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
import createSolidFromString from '../../utils/createSolidFromString';
import {
  ITALIC,
  UNDERLINE,
  weightToStyle,
  letterSpacingToStyle,
  colorToStyle,
} from './customConstants';
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

            case 'letterspacing': {
              const ls = element.style.letterSpacing;
              const lsNumber = ls.split(/[a-z%]/)[0] || 0;
              const lsScaled = Math.round(lsNumber * 100);
              return letterSpacingToStyle(lsScaled);
            }

            case 'color': {
              const rawColor = element.style.color;
              const solid = createSolidFromString(rawColor);
              return colorToStyle(solid);
            }

            default:
              return null;
          }
        })
        .filter((style) => Boolean(style));

      if (styles.length) {
        // This is the reason we need a patch, as multiple styles aren't supported by published package
        // and maintainer clearly doesn't care about it enough to merge.
        // see: <rootDir>/patches/draft-js-import-element+1.4.0.patch
        return Style(styles);
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
