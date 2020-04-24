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
import {
  ITALIC,
  UNDERLINE,
  styleToWeight,
  styleToLetterSpacing,
} from './customConstants';

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
      // Letter spacing
      const letterSpacing = styleToLetterSpacing(style);
      if (letterSpacing) {
        return {
          classes: [...classes, 'letterspacing'],
          css: { ...css, letterSpacing: `${letterSpacing / 100}em` },
        };
      }

      // TODO: Color

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
  if (!editorState) {
    return null;
  }

  const html = stateToHTML(editorState.getCurrentContent(), {
    inlineStyleFn,
    defaultBlockTag: null,
  });

  return html.replace(/<br ?\/?>/g, '').replace(/&nbsp;$/, '');
}

export default exportHTML;
