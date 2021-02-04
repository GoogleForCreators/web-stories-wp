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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

const fontWeightNames = {
  100: __('Thin', 'web-stories'),
  200: __('Extra-light', 'web-stories'),
  300: __('Light', 'web-stories'),
  400: __('Regular', 'web-stories'),
  500: __('Medium', 'web-stories'),
  600: __('Semi-bold', 'web-stories'),
  700: __('Bold', 'web-stories'),
  800: __('Extra-bold', 'web-stories'),
  900: __('Black', 'web-stories'),
};

/**
 * Returns a list of human-readable font weights.
 *
 * @param {Object} [font] Font object.
 * @param {Array<number>} font.weights Font weights.
 * @return {Array<Object<{name: string, value: string}>>}} Font weights list.
 */
function getFontWeights(font) {
  const defaultFontWeights = [{ name: fontWeightNames[400], value: '400' }];

  if (!font?.weights) {
    return defaultFontWeights;
  }

  return font.weights.map((weight) => ({
    name: fontWeightNames[weight],
    value: weight.toString(),
  }));
}

export default getFontWeights;
