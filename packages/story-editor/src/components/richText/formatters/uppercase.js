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
import { NONE, UPPERCASE } from '../customConstants';
import {
  togglePrefixStyle,
  getPrefixStylesInSelection,
} from '../styleManipulation';

function elementToStyle(element) {
  const isSpan = element.tagName.toLowerCase() === 'span';
  const isUppercaseTransform = element.style.textTransform === 'uppercase';
  if (isSpan && isUppercaseTransform) {
    return UPPERCASE;
  }

  return null;
}

function stylesToCSS(styles) {
  const hasUppercase = styles.includes(UPPERCASE);
  if (!hasUppercase) {
    return null;
  }
  return { textTransform: 'uppercase' };
}

function isUppercase(editorState) {
  const styles = getPrefixStylesInSelection(editorState, UPPERCASE);
  return !styles.includes(NONE);
}

function toggleUppercase(editorState, flag) {
  if (typeof flag === 'boolean') {
    return togglePrefixStyle(editorState, UPPERCASE, () => flag);
  }
  return togglePrefixStyle(editorState, UPPERCASE);
}

const formatter = {
  elementToStyle,
  stylesToCSS,
  autoFocus: true,
  getters: {
    isUppercase,
  },
  setters: {
    toggleUppercase,
  },
};

export default formatter;
