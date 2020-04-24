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
import {
  ITALIC,
  UNDERLINE,
  styleToWeight,
  styleToLetterSpacing,
} from './customConstants';

function customInlineDisplay(styles) {
  return styles.toArray().reduce((css, style) => {
    // Italic
    if (style === ITALIC) {
      return { ...css, fontStyle: 'italic' };
    }

    // Underline
    if (style === UNDERLINE) {
      return { ...css, textDecoration: 'underline' };
    }

    // Weight
    const weight = styleToWeight(style);
    if (weight) {
      return { ...css, fontWeight: weight };
    }

    // Letter spacing
    const letterSpacing = styleToLetterSpacing(style);
    if (letterSpacing) {
      return { ...css, letterSpacing: `${letterSpacing / 100}em` };
    }

    // TODO: Color
    // TODO: Letter spacing

    return css;
  }, {});
}

export default customInlineDisplay;
