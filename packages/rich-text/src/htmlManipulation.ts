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
import { EditorState } from 'draft-js';
import { filterEditorState } from 'draftjs-filters';

/**
 * Internal dependencies
 */
import formatters from './formatters';
import getStateInfo from './getStateInfo';
import customImport from './customImport';
import customExport from './customExport';
import { getSelectionForAll } from './util';
import type { StyleSetter, AllowedSetterArgs } from './types';
import {
  ITALIC,
  UNDERLINE,
  WEIGHT,
  COLOR,
  LETTERSPACING,
  UPPERCASE,
  GRADIENT_COLOR,
} from './customConstants';
import { getPrefixStylesInSelection } from './styleManipulation';

/**
 * Return an editor state object with content set to parsed HTML
 * and selection set to everything.
 *
 * @param html  HTML string to parse into content
 * @return New editor state with selection
 */
export function getSelectAllStateFromHTML(html: string) {
  const contentState = customImport(html);
  const initialState = EditorState.createWithContent(contentState);
  const selection = getSelectionForAll(initialState.getCurrentContent());
  return EditorState.forceSelection(initialState, selection);
}

/**
 * Convert HTML via updater function. As updater function works on the
 * current selection in an editor state, first parse HTML to editor state
 * with entire body selected, then run updater and then export back to
 * HTML again.
 *
 * @param html  HTML string to parse into content
 * @param updater  A function converting a state to a new state
 * @param args  Extra args to supply to updater other than state
 * @return New HTML with updates applied
 */
function updateAndReturnHTML(
  html: string,
  updater: StyleSetter,
  ...args: [AllowedSetterArgs]
) {
  const stateWithUpdate = updater(getSelectAllStateFromHTML(html), ...args);
  return customExport(stateWithUpdate);
}

const getHTMLFormatter =
  (setter: StyleSetter) =>
  (html: string, ...args: [AllowedSetterArgs]) =>
    updateAndReturnHTML(html, setter, ...args);

export const getHTMLFormatters = (): {
  [p: string]: (html: string, args: AllowedSetterArgs) => string;
} => {
  return formatters.reduce(
    (aggr, { setters }) => ({
      ...aggr,
      ...Object.fromEntries(
        Object.entries(setters).map(([key, setter]) => [
          key,
          getHTMLFormatter(setter as StyleSetter),
        ])
      ),
    }),
    {}
  );
};

export function getHTMLInfo(html: string) {
  const htmlStateInfo = getStateInfo(getSelectAllStateFromHTML(html));
  return htmlStateInfo;
}

export function sanitizeEditorHtml(html: string) {
  const editorState = getSelectAllStateFromHTML(html);

  const styles: string[] = [
    ...getPrefixStylesInSelection(editorState, ITALIC),
    ...getPrefixStylesInSelection(editorState, UNDERLINE),
    ...getPrefixStylesInSelection(editorState, WEIGHT),
    ...getPrefixStylesInSelection(editorState, COLOR),
    ...getPrefixStylesInSelection(editorState, LETTERSPACING),
    ...getPrefixStylesInSelection(editorState, UPPERCASE),
    ...getPrefixStylesInSelection(editorState, GRADIENT_COLOR),
  ];

  return (
    customExport(
      filterEditorState(
        {
          blocks: [],
          styles,
          entities: [],
          maxNesting: 1,
          whitespacedCharacters: [],
        },
        editorState
      )
    ) || ''
  );
}
