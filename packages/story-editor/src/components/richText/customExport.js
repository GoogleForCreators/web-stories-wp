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
import formatters from './formatters';

function inlineStyleFn(styles) {
  const inlineCSS = formatters.reduce(
    (css, { stylesToCSS }) => ({ ...css, ...stylesToCSS(styles) }),
    {}
  );

  if (Object.keys(inlineCSS).length === 0) {
    return null;
  }

  return {
    element: 'span',
    style: inlineCSS,
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
