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
import { NONE, ITALIC } from '../customConstants';
import {
  togglePrefixStyle,
  getPrefixStylesInSelection,
} from '../styleManipulation';

function elementToStyle(element) {
  const isSpan = element.tagName.toLowerCase() === 'span';
  const isItalicFontStyle = element.style.fontStyle === 'italic';
  if (isSpan && isItalicFontStyle) {
    return ITALIC;
  }

  return null;
}

function stylesToCSS(styles) {
  const hasItalic = styles.includes(ITALIC);
  if (!hasItalic) {
    return null;
  }
  return { fontStyle: 'italic' };
}

function isItalic(editorState) {
  const styles = getPrefixStylesInSelection(editorState, ITALIC);
  return !styles.includes(NONE);
}

function toggleItalic(editorState, flag) {
  if (typeof flag === 'boolean') {
    return togglePrefixStyle(editorState, ITALIC, () => flag);
  }
  return togglePrefixStyle(editorState, ITALIC);
}

const formatter = {
  elementToStyle,
  stylesToCSS,
  autoFocus: true,
  getters: {
    isItalic,
  },
  setters: {
    toggleItalic,
  },
};

export default formatter;
