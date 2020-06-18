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

/**
 * Internal dependencies
 */
import formatters from './formatters';
import getStateInfo from './getStateInfo';
import customImport from './customImport';
import customExport from './customExport';
import { getSelectionForAll } from './util';

/**
 * Return an editor state object with content set to parsed HTML
 * and selection set to everything.
 *
 * @param {string} html  HTML string to parse into content
 * @return {Object} New editor state with selection
 */
export function getSelectAllStateFromHTML(html) {
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
 * @param {string} html  HTML string to parse into content
 * @param {Function} updater  A function converting a state to a new state
 * @param {Array} args  Extra args to supply to updater other than state
 * @return {Object} New HTML with updates applied
 */
function updateAndReturnHTML(html, updater, ...args) {
  const stateWithUpdate = updater(getSelectAllStateFromHTML(html), ...args);
  const renderedHTML = customExport(stateWithUpdate);
  return renderedHTML;
}

const getHTMLFormatter = (setter) => (html, ...args) =>
  updateAndReturnHTML(html, setter, ...args);

export const getHTMLFormatters = () => {
  return formatters.reduce(
    (aggr, { setters }) => ({
      ...aggr,
      ...Object.fromEntries(
        Object.entries(setters).map(([key, setter]) => [
          key,
          getHTMLFormatter(setter),
        ])
      ),
    }),
    {}
  );
};

export function getHTMLInfo(html) {
  const htmlStateInfo = getStateInfo(getSelectAllStateFromHTML(html));
  return htmlStateInfo;
}
