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

import * as hues from '@ap.cx/hues';

/**
 * Calculate luminance from RGB Object
 *
 * @param  {Object} rgb RGB Object. Example: { r, g, b }
 * @return {number} Luminance
 */
export function calculateLuminanceFromRGB(rgb) {
  const { r, g, b, a } = rgb;
  const luminance = hues.relativeLuminance({
    r: r / 255.0,
    g: g / 255.0,
    b: b / 255.0,
    a: a === undefined ? 1.0 : a,
  });
  return luminance;
}

/**
 * Calculate luminance from RGB Object
 *
 * @param  {string} styleColor Color from html element style.color. Example: "rgb(000, 000, 000)"
 * @return {number} Luminance
 */
export function calculateLuminanceFromStyleColor(styleColor) {
  const rgb = hues.str2rgba(styleColor);
  return hues.relativeLuminance(rgb);
}

/**
 * 18 point text or 14 point bold text is judged to be large enough to require a lower contrast ratio.
 * https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
 */
/**
 * Check contrast ratios from luminances for WCAG guidelines
 *
 * @param  {number} luminanceA Luminance A
 * @param  {number} luminanceB Luminance B
 * @param  {number} fontSize Font size
 * @return {Object} WCAG contrast ratio checks
 */
export function checkContrastFromLuminances(luminanceA, luminanceB, fontSize) {
  const ratio = hues.contrast(luminanceA, luminanceB);
  return { ratio, WCAG_AA: hues.aa(ratio, fontSize) };
}
