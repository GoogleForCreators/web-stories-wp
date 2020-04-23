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
import { stateToHTML } from 'draft-js-export-html';

/**
 * Internal dependencies
 */
import { styleToWeight, ITALIC, UNDERLINE } from './customConstants';

function inlineStyleFn(styles) {
  const inline = styles.toArray().reduce(
    ({ classes, css }, style) => {
      // Italic
      if (style === ITALIC) {
        return {
          classes: [...classes, 'italic'],
          css: { ...css, fontStyle: 'italic' },
        };
      }

      // Underline
      if (style === UNDERLINE) {
        return {
          classes: [...classes, 'underline'],
          css: { ...css, textDecoration: 'underline' },
        };
      }

      // Weight
      const weight = styleToWeight(style);
      if (weight) {
        return {
          classes: [...classes, 'weight'],
          css: { ...css, fontWeight: weight },
        };
      }

      // TODO: Color
      // TODO: Letter spacing

      return { classes, css };
    },
    { classes: [], css: {} }
  );

  if (inline.classes.length === 0) {
    return null;
  }

  return {
    element: 'span',
    attributes: { class: inline.classes.join(' ') },
    style: inline.css,
  };
}

function exportHTML(editorState) {
  return stateToHTML(editorState.getCurrentContent(), {
    inlineStyleFn,
    defaultBlockTag: null,
  });
}

export default exportHTML;
