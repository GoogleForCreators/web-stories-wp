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
import { MULTIPLE_VALUE } from '../../../constants';
import { NONE, WEIGHT } from '../customConstants';
import {
  togglePrefixStyle,
  getPrefixStylesInSelection,
} from '../styleManipulation';
import { isStyle, numericToStyle, styleToNumeric } from './util';

const NORMAL_WEIGHT = 400;
const SMALLEST_BOLD = 600;
const DEFAULT_BOLD = 700;

export function weightToStyle(weight) {
  return numericToStyle(WEIGHT, weight);
}

function styleToWeight(style) {
  return styleToNumeric(WEIGHT, style);
}

function elementToStyle(element) {
  const isSpan = element.tagName.toLowerCase() === 'span';
  const fontWeight = parseInt(element.style.fontWeight);
  const hasFontWeight = fontWeight && !isNaN(fontWeight);
  if (isSpan && hasFontWeight && fontWeight !== 400) {
    return weightToStyle(fontWeight);
  }

  return null;
}

function stylesToCSS(styles) {
  const style = styles.find((someStyle) => isStyle(someStyle, WEIGHT));
  if (!style) {
    return null;
  }
  const fontWeight = styleToWeight(style);
  if (!fontWeight) {
    return null;
  }
  return { fontWeight };
}

// convert a set of weight styles to a set of weights
function getWeights(styles) {
  return styles.map((style) =>
    style === NONE ? NORMAL_WEIGHT : styleToWeight(style)
  );
}

function isBold(editorState) {
  const styles = getPrefixStylesInSelection(editorState, WEIGHT);
  const weights = getWeights(styles);
  const allIsBold = weights.every((w) => w >= SMALLEST_BOLD);
  return allIsBold;
}

function toggleBold(editorState, flag) {
  if (typeof flag === 'boolean') {
    if (flag) {
      const getDefault = () => weightToStyle(DEFAULT_BOLD);
      return togglePrefixStyle(editorState, WEIGHT, () => true, getDefault);
    }

    // No fourth arg needed as we're not setting a style
    return togglePrefixStyle(editorState, WEIGHT, () => false);
  }

  // if no flag is set, determine these values from current weights present

  // if any character has weight less than SMALLEST_BOLD,
  // everything should be bolded
  const shouldSetBold = (styles) =>
    getWeights(styles).some((w) => w < SMALLEST_BOLD);

  // if setting a bold, it should be the boldest current weight,
  // though at least DEFAULT_BOLD
  const getBoldToSet = (styles) =>
    weightToStyle(Math.max(...[DEFAULT_BOLD].concat(getWeights(styles))));

  return togglePrefixStyle(editorState, WEIGHT, shouldSetBold, getBoldToSet);
}

function getFontWeight(editorState) {
  const styles = getPrefixStylesInSelection(editorState, WEIGHT);
  const weights = getWeights(styles);
  if (weights.length > 1) {
    return MULTIPLE_VALUE;
  }
  return weights[0];
}

function setFontWeight(editorState, weight) {
  // if the weight to set is non-400, set a style
  // (if 400 is target, all other weights are just removed, and we're good)
  const shouldSetStyle = () => weight !== 400;

  // and if we're setting a style, it's the style for the weight of course
  const getBoldToSet = () => weightToStyle(weight);

  return togglePrefixStyle(editorState, WEIGHT, shouldSetStyle, getBoldToSet);
}

const formatter = {
  elementToStyle,
  stylesToCSS,
  autoFocus: true,
  getters: {
    isBold,
    fontWeight: getFontWeight,
  },
  setters: {
    toggleBold,
    setFontWeight,
  },
};

export default formatter;
