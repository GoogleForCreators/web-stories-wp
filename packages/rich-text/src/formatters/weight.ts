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
import type { DraftInlineStyle, EditorState } from 'draft-js';

/**
 * Internal dependencies
 */
import { MULTIPLE_VALUE, NONE, WEIGHT } from '../customConstants';
import {
  getPrefixStylesInSelection,
  togglePrefixStyle,
} from '../styleManipulation';
import { isStyle, styleToNumeric, weightToStyle } from './util';

const NORMAL_WEIGHT = 400;
const SMALLEST_BOLD = 600;
const DEFAULT_BOLD = 700;

function styleToWeight(style: string) {
  return styleToNumeric(WEIGHT, style);
}

function elementToStyle(element: HTMLElement) {
  const isSpan = element.tagName.toLowerCase() === 'span';
  const fontWeight = parseInt(element.style.fontWeight);
  const hasFontWeight = fontWeight && !isNaN(fontWeight);
  if (isSpan && hasFontWeight && fontWeight !== 400) {
    return weightToStyle(fontWeight);
  }

  return null;
}

function stylesToCSS(styles: DraftInlineStyle) {
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
function getWeights(styles: string[]) {
  return styles.map((style) =>
    style === NONE ? NORMAL_WEIGHT : styleToWeight(style)
  );
}

function isBold(editorState: EditorState) {
  const styles = getPrefixStylesInSelection(editorState, WEIGHT);
  const weights = getWeights(styles);
  return weights.every((w) => w >= SMALLEST_BOLD);
}

function toggleBold(editorState: EditorState, flag?: undefined | boolean) {
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
  const shouldSetBold = (styles: string[] = []) =>
    getWeights(styles).some((w) => w < SMALLEST_BOLD);

  // if setting a bold, it should be the boldest current weight,
  // though at least DEFAULT_BOLD
  const getBoldToSet = (styles: string[] = []) =>
    weightToStyle(Math.max(...[DEFAULT_BOLD].concat(getWeights(styles))));

  return togglePrefixStyle(editorState, WEIGHT, shouldSetBold, getBoldToSet);
}

function getFontWeight(editorState: EditorState) {
  const styles = getPrefixStylesInSelection(editorState, WEIGHT);
  const weights = getWeights(styles);
  if (weights.length > 1) {
    return MULTIPLE_VALUE;
  }
  return weights[0];
}

function setFontWeight(editorState: EditorState, weight = 0) {
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
