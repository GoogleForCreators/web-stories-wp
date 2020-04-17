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
import generatePatternStyles from '../../../utils/generatePatternStyles';
import convertToCSS from '../../../utils/convertToCSS';
import {generateFontFamily} from "../../../elements/text/util";

export function findMatchingColor(color, stylePresets, isText) {
  const colorsToMatch = isText
    ? stylePresets.textColors
    : stylePresets.fillColors;
  const patternType = isText ? 'color' : 'background';
  const toAdd = generatePatternStyles(color, patternType);
  return colorsToMatch.find((value) => {
    const existing = generatePatternStyles(value, patternType);
    return Object.keys(toAdd).every((key) => existing[key] === toAdd[key]);
  });
}

export function generatePresetStyle(preset) {
  debugger;
  const { color, backgroundColor, padding, fontFamily, fontFallback } = preset;
  // @todo Generate a constant with mappings/callbacks instead?
  // @todo What to display in case of padding? Get the padding percentage and then display that in relation to the preset size.
  // @todo Filter null out.
  return {
    padding: `${padding?.vertical ? 2 : 0}px ${padding?.horizontal ? 2 : 0}px`,
    fontFamily: generateFontFamily(fontFamily, fontFallback),
    ...generatePatternStyles(color, 'color'),
    ...generatePatternStyles(backgroundColor, 'background'),
  };
}
