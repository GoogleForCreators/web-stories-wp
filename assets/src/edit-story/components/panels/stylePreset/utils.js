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
import createSolid from '../../../utils/createSolid';
import objectPick from '../../../utils/objectPick';
import { MULTIPLE_VALUE } from '../../form';
import { getHTMLInfo } from '../../richText/htmlManipulation';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../../app/font/defaultFonts';

export function findMatchingColor(color, stylePresets, isText) {
  const colorsToMatch = isText
    ? stylePresets.textColors
    : stylePresets.fillColors;
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

function hasStylePreset({ font, backgroundTextMode }) {
  const { family } = font;
  return (
    TEXT_ELEMENT_DEFAULT_FONT.family !== family ||
    backgroundTextMode !== BACKGROUND_TEXT_MODE.NONE
  );
}

export function getTextPresets(elements, stylePresets) {
  // @todo Fix: Currently when two selected elements have the same attributes, two presets are added.
  return {
    textColors: elements
      .filter((text) => !hasStylePreset(text))
      .map(({ content }) => getHTMLInfo(content).color)
      .filter((color) => color !== MULTIPLE_VALUE)
      .filter((color) => !findMatchingColor(color, stylePresets, true)),
    textStyles: elements
      .filter((text) => hasStylePreset(text))
      .map((text) => {
        const extractedColor = getHTMLInfo(text.content).color;
        const color =
          extractedColor === MULTIPLE_VALUE
            ? createSolid(0, 0, 0)
            : extractedColor;
        return {
          color,
          ...objectPick(text, [
            'backgroundColor',
            'backgroundTextMode',
            'font',
          ]),
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
