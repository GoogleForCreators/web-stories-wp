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
import { generateFontFamily } from '../../../elements/text/util';
import { BACKGROUND_TEXT_MODE } from '../../../constants';
import convertToCSS from '../../../utils/convertToCSS';

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

export function findMatchingStylePreset(preset, stylePresets) {
  const stylesToMatch = stylePresets.styles;
  const toAdd = convertToCSS(generatePresetStyle(preset));
  return stylesToMatch.find(
    (value) => toAdd === convertToCSS(generatePresetStyle(value))
  );
}

export function generatePresetStyle(preset, prepareForCSS) {
  const {
    color,
    backgroundColor,
    padding,
    fontFamily,
    fontFallback,
    backgroundTextMode,
  } = preset;
  let style = {
    padding: `${padding?.vertical ? 2 : 0}px ${padding?.horizontal ? 2 : 0}px`,
    fontFamily: generateFontFamily(fontFamily, fontFallback),
    ...generatePatternStyles(color, 'color'),
  };
  // If it's highlight mode then the highlight is displayed on the text wrapper instead.
  if (!prepareForCSS || backgroundTextMode !== BACKGROUND_TEXT_MODE.HIGHLIGHT) {
    style = {
      ...style,
      ...generatePatternStyles(backgroundColor, 'background'),
    };
  }
  // @todo Generate a constant with mappings/callbacks instead?
  // @todo What to display in case of padding? Get the padding percentage and then display that in relation to the preset size.
  // @todo Filter null out.
  return style;
}

function hasStylePreset({ fontFamily, backgroundTextMode }) {
  const defaultFont = 'Roboto';
  return (
    defaultFont !== fontFamily ||
    backgroundTextMode !== BACKGROUND_TEXT_MODE.NONE
  );
}

export function getTextPresets(elements, stylePresets) {
  return {
    textColors: elements
      .filter((text) => !hasStylePreset(text))
      .map(({ color }) => color)
      .filter((color) => !findMatchingColor(color, stylePresets, true)),
    styles: elements
      .filter((text) => hasStylePreset(text))
      .map((text) => {
        const {
          color,
          backgroundColor,
          backgroundTextMode,
          padding,
          fontFamily,
          fontFallback,
        } = text;
        return {
          color,
          backgroundColor,
          backgroundTextMode,
          padding,
          fontFamily,
          fontFallback,
        };
      })
      .filter((preset) => !findMatchingStylePreset(preset, stylePresets)),
  };
}

export function getShapePresets(elements, stylePresets) {
  // Shapes only support fillColors currently.
  return {
    fillColors: elements
      .map(({ backgroundColor }) => {
        return backgroundColor ? backgroundColor : null;
      })
      .filter(
        (color) => color && !findMatchingColor(color, stylePresets, false)
      ),
  };
}
