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
import {
  convertToCSS,
  createSolid,
  generatePatternStyles,
  isPatternEqual,
} from '@web-stories-wp/patterns';

/**
 * Internal dependencies
 */
import { generateFontFamily } from '../elements/text/util';
import {
  BACKGROUND_TEXT_MODE,
  MULTIPLE_VALUE,
  SAVED_STYLE_HEIGHT,
  STYLE_PRESETS_PER_ROW,
  PRESET_TYPES,
} from '../constants';
import { getHTMLInfo } from '../components/richText/htmlManipulation';
import objectPick from './objectPick';

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
  const { color, fontWeight, isItalic, isUnderline, letterSpacing } =
    getHTMLInfo(content);
  return {
    color: color !== MULTIPLE_VALUE ? color : createSolid(0, 0, 0),
    fontWeight: getExtractedInlineValue(fontWeight),
    isItalic: getExtractedInlineValue(isItalic),
    isUnderline: getExtractedInlineValue(isUnderline),
    letterSpacing: getExtractedInlineValue(letterSpacing),
  };
}

export function getTextPresets(elements, storyStyles, type) {
  const colors =
    PRESET_TYPES.STYLE === type
      ? []
      : elements
          .map(({ content }) => getHTMLInfo(content).color)
          .filter((color) => color !== MULTIPLE_VALUE)
          .filter(
            (color) => color && !findMatchingColor(color, storyStyles, true)
          );

  const textStyles =
    PRESET_TYPES.COLOR === type
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
    colors,
    textStyles,
  };
}

export function getShapePresets(elements, storyStyles) {
  const colors = elements
    .map(({ backgroundColor }) => {
      return backgroundColor ? backgroundColor : null;
    })
    .filter((color) => color && !findMatchingColor(color, storyStyles, false));
  return {
    colors,
  };
}

export function getPagePreset(page, storyStyles) {
  return {
    colors: [page.backgroundColor].filter(
      (color) => color && !findMatchingColor(color, storyStyles, false)
    ),
  };
}

export function areAllType(elType, selectedElements) {
  return (
    selectedElements.length > 0 &&
    selectedElements.every(({ type }) => elType === type)
  );
}

export function getPanelInitialHeight(presets) {
  // Includes the helper text and button for saving a color.
  const presetsCount = presets.length;
  let initialHeight = 0;
  if (presetsCount > 0) {
    initialHeight =
      Math.max(1.5, Math.ceil(presets.length / STYLE_PRESETS_PER_ROW)) *
      SAVED_STYLE_HEIGHT;
  }
  return Math.min(initialHeight, window.innerHeight / 3);
}
