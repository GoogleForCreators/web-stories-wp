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
import {
  toggleBold,
  toggleItalic,
  toggleUnderline,
  setFontWeight,
  getStateInfo,
} from './styleManipulation';
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

export function toggleBoldInHTML(html, flag) {
  return updateAndReturnHTML(html, toggleBold, flag);
}
export function setFontWeightInHTML(html, weight) {
  return updateAndReturnHTML(html, setFontWeight, weight);
}
export function toggleItalicInHTML(html, flag) {
  return updateAndReturnHTML(html, toggleItalic, flag);
}
export function toggleUnderlineInHTML(html, flag) {
  return updateAndReturnHTML(html, toggleUnderline, flag);
}

export function getHTMLInfo(html) {
  return getStateInfo(getSelectAllStateFromHTML(html));
}
