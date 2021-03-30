/*
 * Copyright 2021 Google LLC
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
import { generateFontFamily } from '@web-stories-wp/fonts';

/**
 * Internal dependencies
 */
import calcFontMetrics from './calcFontMetrics';

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
function generateParagraphTextStyle(
  props,
  dataToStyleX,
  dataToStyleY,
  dataToFontSizeY = dataToStyleY,
  element,
  dataToPaddingY = dataToStyleY
) {
  const { font, fontSize, lineHeight, padding, textAlign } = props;
  const { marginOffset } = calcFontMetrics(element);
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
    padding: `${dataToStyleY(padding?.vertical || 0)}px ${dataToStyleX(
      padding?.horizontal || 0
    )}px`,
  };
}

export default generateParagraphTextStyle;
