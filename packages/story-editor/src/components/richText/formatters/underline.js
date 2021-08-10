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
import { NONE, UNDERLINE } from '../customConstants';
import {
  togglePrefixStyle,
  getPrefixStylesInSelection,
} from '../styleManipulation';

function elementToStyle(element) {
  const isSpan = element.tagName.toLowerCase() === 'span';
  const isUnderlineDecoration = element.style.textDecoration === 'underline';
  if (isSpan && isUnderlineDecoration) {
    return UNDERLINE;
  }

  return null;
}

function stylesToCSS(styles) {
  const hasUnderline = styles.includes(UNDERLINE);
  if (!hasUnderline) {
    return null;
  }
  return { textDecoration: 'underline' };
}

function isUnderline(editorState) {
  const styles = getPrefixStylesInSelection(editorState, UNDERLINE);
  return !styles.includes(NONE);
}

function toggleUnderline(editorState, flag) {
  if (typeof flag === 'boolean') {
    return togglePrefixStyle(editorState, UNDERLINE, () => flag);
  }
  return togglePrefixStyle(editorState, UNDERLINE);
}

const formatter = {
  elementToStyle,
  stylesToCSS,
  autoFocus: true,
  getters: {
    isUnderline,
  },
  setters: {
    toggleUnderline,
  },
};

export default formatter;
