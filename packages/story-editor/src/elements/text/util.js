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
 * Generates paragraph text style for a text element.
 *
 * @param {Object} props Props.
 * @param {function(number):any} dataToStyleX Converts a x-unit to CSS.
 * @param {function(number):any} dataToStyleY Converts a y-unit to CSS.
 * @param {function(number):any} dataToFontSizeY Converts a font-size metric to
 * y-unit CSS.
 * @param {Object<*>} element Text element properties.
 * @param {function(number):any} dataToPaddingY Falls back to dataToStyleX if not provided.
 * @return {Object} The map of text style properties and values.
 */
export function generateParagraphTextStyle(
  props,
  dataToStyleX,
  dataToStyleY,
  dataToFontSizeY = dataToStyleY,
  element,
  dataToPaddingY = dataToStyleY
) {
  const { font, fontSize, lineHeight, padding, textAlign } = props;
  const { marginOffset } = calcFontMetrics(element);

  const verticalPadding = padding?.vertical || 0;
  const horizontalPadding = padding?.horizontal || 0;
  const hasPadding = verticalPadding || horizontalPadding;
  const paddingStyle = hasPadding
    ? `${dataToStyleY(verticalPadding)} ${dataToStyleX(horizontalPadding)}`
    : 0;

  return {
    dataToEditorY: dataToStyleY,
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
    margin: `${dataToPaddingY(-marginOffset / 2)} 0`,
    fontFamily: generateFontFamily(font),
    fontSize: dataToFontSizeY(fontSize),
    font,
    lineHeight,
    textAlign,
    padding: paddingStyle,
  };
}

export const generateFontFamily = ({ family, fallbacks } = {}) => {
  const genericFamilyKeywords = [
    'cursive',
    'fantasy',
    'monospace',
    'serif',
    'sans-serif',
  ];
  // Wrap into " since some fonts won't work without it.
  let fontFamilyDisplay = family ? `"${family}"` : '';
  if (fallbacks && fallbacks.length) {
    fontFamilyDisplay += family ? `,` : ``;
    fontFamilyDisplay += fallbacks
      .map((fallback) =>
        genericFamilyKeywords.includes(fallback) ? fallback : `"${fallback}"`
      )
      .join(`,`);
  }
  return fontFamilyDisplay;
};

export const getHighlightLineheight = function (
  lineHeight,
  verticalPadding = 0,
  unit = 'px'
) {
  if (verticalPadding === 0) {
    return `${lineHeight}em`;
  }
  return `calc(${lineHeight}em ${verticalPadding > 0 ? '+' : '-'} ${
    2 * Math.abs(verticalPadding)
  }${unit})`;
};

export function calcFontMetrics(element) {
  if (!element.font?.metrics) {
    return {
      contentAreaPx: 0,
      lineBoxPx: 0,
      marginOffset: 0,
    };
  }

  const {
    fontSize,
    lineHeight,
    font: {
      metrics: { upm, asc, des },
    },
  } = element;

  // We cant to cut some of the "virtual-area"
  // More info: https://iamvdo.me/en/blog/css-font-metrics-line-height-and-vertical-align
  const contentAreaPx = ((asc - des) / upm) * fontSize;
  const lineBoxPx = lineHeight * fontSize;
  const marginOffset = lineBoxPx - contentAreaPx;

  return {
    marginOffset,
    contentAreaPx,
    lineBoxPx,
  };
}
