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
import isPatternEqual from '../../../../utils/isPatternEqual';
import convertToCSS from '../../../../utils/convertToCSS';
import generatePatternStyles from '../../../../utils/generatePatternStyles';
import objectPick from '../../../../utils/objectPick';
import createSolid from '../../../../utils/createSolid';
import { generateFontFamily } from '../../../../elements/text/util';
import {
  BACKGROUND_TEXT_MODE,
  COLOR_PRESETS_PER_ROW,
  MULTIPLE_VALUE,
  SAVED_COLOR_SIZE,
  SAVED_STYLE_HEIGHT,
  STYLE_PRESETS_PER_ROW,
} from '../../../../constants';
import { getHTMLInfo } from '../../../richText/htmlManipulation';

const TEXT_PRESET_STYLES = [
  'backgroundColor',
  'backgroundTextMode',
  'font',
  'fontSize',
  'lineHeight',
  'padding',
  'textAlign',
];

export function findMatchingColor(color, storyStyles, isText) {
  const colorsToMatch = storyStyles.colors;
  const patternType = isText ? 'color' : 'background';
  return colorsToMatch.find((value) => {
    try {
      return isPatternEqual(value, color, patternType);
    } catch (e) {
      // Some preset couldn't be rendered as patternType
      return false;
    }
  });
}

export function findMatchingStylePreset(preset, storyStyles) {
  const stylesToMatch = storyStyles.textStyles;
  const toAdd = convertToCSS(generatePresetStyle(preset));
  return stylesToMatch.find(
    (value) => toAdd === convertToCSS(generatePresetStyle(value))
  );
}

export function generatePresetStyle(preset, prepareForCSS) {
  const {
    color,
    backgroundColor,
    font,
    fontWeight,
    backgroundTextMode,
    textAlign,
    letterSpacing,
    lineHeight,
    isItalic,
    isUnderline,
    padding,
    fontSize,
  } = preset;
  let style = {
    textAlign,
    letterSpacing,
    fontWeight,
    textDecoration: isUnderline ? 'underline' : null,
    fontStyle: isItalic ? 'italic' : null,
    fontFamily: generateFontFamily(font),
    ...generatePatternStyles(color, 'color'),
  };

  if (!prepareForCSS) {
    // If we're not preparing the matching style for actual CSS, add background text mode as well here.
    style = {
      ...style,
      fontSize,
      lineHeight,
      padding,
      backgroundTextMode,
    };
  }

  // Generate background only if it's on.
  // If it's highlight mode then the highlight is displayed on the text wrapper instead.
  if (
    backgroundTextMode !== BACKGROUND_TEXT_MODE.NONE &&
    (!prepareForCSS || backgroundTextMode !== BACKGROUND_TEXT_MODE.HIGHLIGHT)
  ) {
    style = {
      ...style,
      ...generatePatternStyles(backgroundColor, 'background'),
    };
  }
  return style;
}

function getExtractedInlineValue(value) {
  return value !== MULTIPLE_VALUE ? value : null;
}

function getTextInlineStyles(content) {
  const {
    color,
    fontWeight,
    isItalic,
    isUnderline,
    letterSpacing,
  } = getHTMLInfo(content);
  return {
    color: color !== MULTIPLE_VALUE ? color : createSolid(0, 0, 0),
    fontWeight: getExtractedInlineValue(fontWeight),
    isItalic: getExtractedInlineValue(isItalic),
    isUnderline: getExtractedInlineValue(isUnderline),
    letterSpacing: getExtractedInlineValue(letterSpacing),
  };
}

function getUniquePresets(presets) {
  const list = presets.map((preset) => JSON.stringify(preset));
  return Array.from(new Set(list)).map((preset) => JSON.parse(preset));
}

export function getTextPresets(elements, storyStyles, type) {
  const allColors =
    'style' === type
      ? []
      : elements
          .map(({ content }) => getHTMLInfo(content).color)
          .filter((color) => color !== MULTIPLE_VALUE)
          .filter(
            (color) => color && !findMatchingColor(color, storyStyles, true)
          );

  const allStyles =
    'color' === type
      ? []
      : elements
          .map((text) => {
            return {
              ...objectPick(text, TEXT_PRESET_STYLES),
              ...getTextInlineStyles(text.content),
            };
          })
          .filter((preset) => !findMatchingStylePreset(preset, storyStyles));
  return {
    colors: getUniquePresets(allColors),
    textStyles: getUniquePresets(allStyles),
  };
}

export function getShapePresets(elements, storyStyles) {
  const colors = elements
    .map(({ backgroundColor }) => {
      return backgroundColor ? backgroundColor : null;
    })
    .filter((color) => color && !findMatchingColor(color, storyStyles, false));
  return {
    colors: getUniquePresets(colors),
  };
}

export function getPagePreset(page, storyStyles) {
  return {
    colors: [page.backgroundColor].filter(
      (color) => color && !findMatchingColor(color, storyStyles, false)
    ),
  };
}

function colorHasTransparency(color) {
  return color.a !== undefined && color.a < 1;
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
  return Boolean(type) && 'solid' !== type;
}

export function areAllType(elType, selectedElements) {
  return (
    selectedElements.length > 0 &&
    selectedElements.every(({ type }) => elType === type)
  );
}

export function getOpaqueColor(preset) {
  const { color } = preset;
  return {
    color: {
      ...color,
      a: 1,
    },
  };
}

export function getPanelInitialHeight(isColor, presets) {
  const rowHeight = isColor ? SAVED_COLOR_SIZE : SAVED_STYLE_HEIGHT;
  // Includes the helper text and button for saving a color.
  const emptyColorsHeight = 140;
  const presetsCount = presets.length;
  let initialHeight = 0;
  if (presetsCount > 0) {
    const presetsPerRow = isColor
      ? COLOR_PRESETS_PER_ROW
      : STYLE_PRESETS_PER_ROW;
    initialHeight =
      Math.max(1.5, Math.ceil(presets.length / presetsPerRow)) * rowHeight;
  } else if (isColor) {
    initialHeight = emptyColorsHeight;
  }
  return Math.min(initialHeight, window.innerHeight / 3);
}
