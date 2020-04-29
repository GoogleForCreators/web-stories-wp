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

function getSelectAllStateFromHTML(html) {
  const contentState = customImport(html);
  const initialState = EditorState.createWithContent(contentState);
  const selection = getSelectionForAll(initialState.getCurrentContent());
  return EditorState.forceSelection(initialState, selection);
}

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
