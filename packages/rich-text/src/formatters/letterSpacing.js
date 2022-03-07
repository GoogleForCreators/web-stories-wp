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
import { NONE, LETTERSPACING, MULTIPLE_VALUE } from '../customConstants';
import {
  togglePrefixStyle,
  getPrefixStylesInSelection,
} from '../styleManipulation';
import { isStyle, numericToStyle, styleToNumeric } from './util';

function letterSpacingToStyle(weight) {
  return numericToStyle(LETTERSPACING, weight);
}

function styleToLetterSpacing(style) {
  return styleToNumeric(LETTERSPACING, style);
}

function elementToStyle(element) {
  const isSpan = element.tagName.toLowerCase() === 'span';
  // This will implicitly strip any trailing unit from the value - it's assumed to be em
  const letterSpacing = parseFloat(element.style.letterSpacing);
  const hasLetterSpacing = letterSpacing && !isNaN(letterSpacing);
  if (isSpan && hasLetterSpacing) {
    return letterSpacingToStyle(letterSpacing * 100);
  }

  return null;
}

function stylesToCSS(styles) {
  const style = styles.find((someStyle) => isStyle(someStyle, LETTERSPACING));
  if (!style) {
    return null;
  }
  const letterSpacing = styleToLetterSpacing(style);
  if (!letterSpacing) {
    return null;
  }
  return { letterSpacing: `${letterSpacing / 100}em` };
}

function getLetterSpacing(editorState) {
  const styles = getPrefixStylesInSelection(editorState, LETTERSPACING);
  if (styles.length > 1) {
    return MULTIPLE_VALUE;
  }
  const spacingStyle = styles[0];
  if (spacingStyle === NONE) {
    return 0;
  }
  return styleToLetterSpacing(spacingStyle);
}

function setLetterSpacing(editorState, letterSpacing) {
  // if the spacing to set to non-0, set a style
  const shouldSetStyle = () => letterSpacing !== 0;

  // and if we're setting a style, it's the style for the spacing of course
  const getStyleToSet = () => letterSpacingToStyle(letterSpacing);

  return togglePrefixStyle(
    editorState,
    LETTERSPACING,
    shouldSetStyle,
    getStyleToSet
  );
}

const formatter = {
  elementToStyle,
  stylesToCSS,
  autoFocus: false,
  getters: {
    letterSpacing: getLetterSpacing,
  },
  setters: {
    setLetterSpacing,
  },
};

export default formatter;
