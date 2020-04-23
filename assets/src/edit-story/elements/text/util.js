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
 * @param {Object} element Text element properties.
 * @param {function(number):any} dataToStyleX Converts a x-unit to CSS.
 * @param {function(number):any} dataToStyleY Converts a y-unit to CSS.
 * @param {function(number):any} dataToFontSizeY Converts a font-size metric to
 * y-unit CSS.
 * @return {Object} The map of text style properties and values.
 */
export function generateParagraphTextStyle(
  element,
  dataToStyleX,
  dataToStyleY,
  dataToFontSizeY = dataToStyleY
) {
  const {
    fontFamily,
    fontFallback,
    fontSize,
    fontStyle,
    fontWeight,
    lineHeight,
    letterSpacing,
    padding,
    textAlign,
    textDecoration,
  } = element;
  return {
    whiteSpace: 'pre-wrap',
    margin: 0,
    fontFamily: generateFontFamily(fontFamily, fontFallback),
    fontSize: dataToFontSizeY(fontSize),
    fontStyle,
    fontWeight,
    lineHeight,
    letterSpacing: `${typeof letterSpacing === 'number' ? letterSpacing : 0}em`,
    textAlign,
    textDecoration,
    padding: `${dataToStyleY(padding?.vertical || 0)}px ${dataToStyleX(
      padding?.horizontal || 0
    )}px`,
  };
}

export const generateFontFamily = (fontFamily, fontFallback) => {
  const genericFamilyKeywords = [
    'cursive',
    'fantasy',
    'monospace',
    'serif',
    'sans-serif',
  ];
  // Wrap into " since some fonts won't work without it.
  let fontFamilyDisplay = fontFamily ? `"${fontFamily}"` : null;
  if (fontFallback && fontFallback.length) {
    fontFamilyDisplay += fontFamily ? `,` : ``;
    fontFamilyDisplay += fontFallback
      .map((fallback) =>
        genericFamilyKeywords.includes(fallback) ? fallback : `"${fallback}"`
      )
      .join(`,`);
  }
  return fontFamilyDisplay;
};

export const getHighlightLineheight = function (
  lineHeight,
  verticalPadding,
  unit = 'px'
) {
  return `calc(
    ${lineHeight}em
    ${verticalPadding > 0 ? '+' : '-'}
    ${2 * Math.abs(verticalPadding)}${unit}
  )`;
};
