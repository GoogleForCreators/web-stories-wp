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
import ColorContrastChecker from 'color-contrast-checker';

// Parse style.color from "rgb(000, 000, 000)" into {r, g, b} format
function parseRGBFromStyleColor(styleColor) {
  const [r, g, b] = styleColor.match(/\d+/g).map((number) => parseInt(number));
  return { r, g, b };
}

/**
 * Calculate luminance from RGB Object
 *
 * @param  {Object} rgb RGB Object. Example: { r, g, b }
 * @return {number} Luminance
 */
export function calculateLuminanceFromRGB(rgb) {
  const ccc = new ColorContrastChecker();
  const lrgb = ccc.calculateLRGB(rgb);
  return ccc.calculateLuminance(lrgb);
}

/**
 * Calculate luminance from RGB Object
 *
 * @param  {string} styleColor Color from html element style.color. Example: "rgb(000, 000, 000)"
 * @return {number} Luminance
 */
export function calculateLuminanceFromStyleColor(styleColor) {
  const rgb = parseRGBFromStyleColor(styleColor);
  return calculateLuminanceFromRGB(rgb);
}

/**
 * Check contrast ratios from luminances for WCAG guidelines
 *
 * @param  {number} luminanceA Luminance A
 * @param  {number} luminanceB Luminance B
 * @param  {number} fontSize Optional fontSize for checking contrast ratio
 * @return {Object} WCAG contrast ratio checks
 */
export function checkContrastFromLuminances(luminanceA, luminanceB, fontSize) {
  const ccc = new ColorContrastChecker();
  if (fontSize) {
    ccc.fontSize = fontSize;
  }
  const contrastRatio = ccc.getContrastRatio(luminanceA, luminanceB);
  return ccc.verifyContrastRatio(contrastRatio);
}
