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
import isPatternEqual from '../../../utils/isPatternEqual';
import convertToCSS from '../../../utils/convertToCSS';
import generatePatternStyles from '../../../utils/generatePatternStyles';
import { generateFontFamily } from '../../../elements/text/util';
import { BACKGROUND_TEXT_MODE } from '../../../constants';
import { MULTIPLE_VALUE } from '../../form';
import { getHTMLInfo } from '../../richText/htmlManipulation';

export function findMatchingColor(color, stylePresets, isText) {
  const colorsToMatch = stylePresets.colors;
  const patternType = isText ? 'color' : 'background';
  return colorsToMatch.find((value) =>
    isPatternEqual(value, color, patternType)
  );
}

export function findMatchingStylePreset(preset, stylePresets) {
  const stylesToMatch = stylePresets.textStyles;
  const toAdd = convertToCSS(generatePresetStyle(preset));
  return stylesToMatch.find(
    (value) => toAdd === convertToCSS(generatePresetStyle(value))
  );
}

export function generatePresetStyle(preset, prepareForCSS) {
  const { color, backgroundColor, font, backgroundTextMode } = preset;
  let style = {
    fontFamily: generateFontFamily(font),
    ...generatePatternStyles(color, 'color'),
  };

  // If it's highlight mode then the highlight is displayed on the text wrapper instead.
  if (!prepareForCSS || backgroundTextMode !== BACKGROUND_TEXT_MODE.HIGHLIGHT) {
    style = {
      ...style,
      ...generatePatternStyles(backgroundColor, 'background'),
    };
  }
  return style;
}

export function getTextPresets(elements, stylePresets) {
  // @todo Fix: Currently when two selected elements have the same attributes, two presets are added.
  return {
    colors: elements
      .map(({ content }) => getHTMLInfo(content).color)
      .filter((color) => color !== MULTIPLE_VALUE)
      .filter(
        (color) => color && !findMatchingColor(color, stylePresets, true)
      ),
  };
}

export function getShapePresets(elements, stylePresets) {
  return {
    colors: elements
      .map(({ backgroundColor }) => {
        return backgroundColor ? backgroundColor : null;
      })
      .filter(
        (color) => color && !findMatchingColor(color, stylePresets, false)
      ),
  };
}

export function getPagePreset(page, stylePresets) {
  return {
    colors: [page.backgroundColor].filter(
      (color) => color && !findMatchingColor(color, stylePresets, false)
    ),
  };
}

function colorHasTransparency(color) {
  return color.a && color.a < 1;
}

export function presetHasOpacity(preset) {
  const { color, stops } = preset;
  if (color) {
    return Boolean(colorHasTransparency(color));
  }
  let opacityFound = false;
  for (const colorStop of stops) {
    if (colorHasTransparency(colorStop.color)) {
      opacityFound = true;
      break;
    }
  }
  return opacityFound;
}

export function presetHasGradient({ type }) {
  return Boolean(type && 'solid' !== type);
}
