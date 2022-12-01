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
} from '@googleforcreators/patterns';
import { getHTMLInfo } from '@googleforcreators/rich-text';
import { generateFontFamily } from '@googleforcreators/element-library';
import { BACKGROUND_TEXT_MODE } from '@googleforcreators/elements';
import type { Pattern } from '@googleforcreators/patterns';
import type {
  Element,
  DefaultBackgroundElement,
  TextElement,
  ElementType,
  Page,
} from '@googleforcreators/elements';
/**
 * Internal dependencies
 */
import { PRESET_TYPES, MULTIPLE_VALUE } from '../constants';
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

interface storyStylesProps {
  colors: string[];
  textStyles: string[];
}

interface presetProps {
  color: string;
  backgroundColor: string;
  font: string;
  fontWeight: string;
  backgroundTextMode: string;
  textAlign: string;
  letterSpacing: string;
  lineHeight: string;
  isItalic: boolean;
  isUnderline: boolean;
  padding: string;
  fontSize: string;
}

export function findMatchingColor(
  color: Pattern,
  storyStyles: storyStylesProps,
  isText: boolean
) {
  const colorsToMatch = storyStyles.colors;
  const patternType = isText ? 'color' : 'background';
  return colorsToMatch.find((value: string) => {
    try {
      return isPatternEqual(value, color, patternType);
    } catch (e) {
      // Some preset couldn't be rendered as patternType
      return false;
    }
  });
}

export function findMatchingStylePreset(
  preset: presetProps,
  storyStyles: storyStylesProps
) {
  const stylesToMatch = storyStyles.textStyles;
  const toAdd = convertToCSS(generatePresetStyle(preset));
  return stylesToMatch.find(
    (value) => toAdd === convertToCSS(generatePresetStyle(value))
  );
}

export function generatePresetStyle(
  preset: presetProps,
  prepareForCSS = false
) {
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
    letterSpacing: `${letterSpacing / 100}em`,
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

export function getTextInlineStyles(content: string) {
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

export function getTextPresets(
  elements: TextElement[],
  storyStyles: storyStylesProps,
  type: string,
  isBackgroundColor: boolean
) {
  const colors =
    PRESET_TYPES.STYLE === type
      ? []
      : elements
          .map(({ content, backgroundColor }) =>
            isBackgroundColor ? backgroundColor : getHTMLInfo(content).color
          )
          .filter((color) => color !== MULTIPLE_VALUE)
          .filter(
            (color) => color && !findMatchingColor(color, storyStyles, true)
          );

  const textStyles =
    PRESET_TYPES.COLOR === type
      ? []
      : elements
          .map((text: TextElement) => {
            return {
              ...objectPick(text, TEXT_PRESET_STYLES),
              ...getTextInlineStyles(text.content),
            } as presetProps;
          })
          .filter((preset) => !findMatchingStylePreset(preset, storyStyles));
  return {
    colors,
    textStyles,
  };
}

export function getShapePresets(
  elements: DefaultBackgroundElement[],
  storyStyles: storyStylesProps
) {
  const colors = elements
    .map(({ backgroundColor }) => {
      return backgroundColor ? backgroundColor : null;
    })
    .filter((color) => color && !findMatchingColor(color, storyStyles, false));
  return {
    colors,
  };
}

export function getPagePreset(page: Page, storyStyles: storyStylesProps) {
  return {
    colors: [page.backgroundColor].filter(
      (color) => color && !findMatchingColor(color, storyStyles, false)
    ),
  };
}

export function areAllType(elType: ElementType, selectedElements: Element[]) {
  return (
    selectedElements.length > 0 &&
    selectedElements.every(({ type }) => elType === type)
  );
}
