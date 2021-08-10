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

/**
 * Calculates contrast between two rgb colors, considering font size.
 *
 * @param {Object} rgb1 First color.
 * @param {Object} rgb2 Second color.
 * @param {number} fontSize Font size.
 * @return {{WCAG_AA: boolean, ratio: *}} Object including contrast ratio and true/false if the contrast has WCAG AA rating.
 */
function calculateContrast(rgb1, rgb2, fontSize) {
  const lum1 = calculateLuminanceFromRGB({
    r: rgb1[0],
    g: rgb1[1],
    b: rgb1[2],
  });
  const lum2 = calculateLuminanceFromRGB({
    r: rgb2[0],
    g: rgb2[1],
    b: rgb2[2],
  });
  return checkContrastFromLuminances(lum1, lum2, fontSize);
}

/**
 * Gets accessible colors from pixel data. Returns the text color and background color.
 *
 * @param {Array} pixelData Array of pixel data.
 * @param {number} fontSize Font size, influences the contrast rating.
 * @return {Object} Returns object consisting of color and backgroundColor in case relevant.
 */
export function getAccessibleTextColorsFromPixels(pixelData, fontSize) {
  const white = [255, 255, 255, 255];
  const black = [0, 0, 0, 255];
  const colors = [];

  const whiteRgb = {
    r: 255,
    g: 255,
    b: 255,
    a: 1,
  };
  const blackRgb = {
    r: 0,
    g: 0,
    b: 0,
    a: 1,
  };

  for (let i = 0; i < pixelData.length; i += 4) {
    colors.push([
      pixelData[i],
      pixelData[i + 1],
      pixelData[i + 2],
      pixelData[i + 3],
    ]);
  }

  const contrasts = colors.map((c) => calculateContrast(black, c, fontSize));
  const contrastIsOK = !contrasts.some(({ WCAG_AA }) => !WCAG_AA);

  if (contrastIsOK) {
    return {
      color: blackRgb,
    };
  }

  // Try white color.
  const altContrasts = colors.map((c) => calculateContrast(white, c, fontSize));
  const altContrastIsOK = !altContrasts.some(({ WCAG_AA }) => !WCAG_AA);

  if (altContrastIsOK) {
    return {
      color: whiteRgb,
    };
  }

  const whiteHighlightWorksBetter =
    contrasts.reduce((a, c) => a + c.ratio, 0) <
    altContrasts.reduce((a, c) => a + c.ratio, 0);

  if (whiteHighlightWorksBetter) {
    // Black fg color and white bg color.
    return {
      color: blackRgb,
      backgroundColor: { ...whiteRgb, a: 0.7 },
    };
  }

  // White fg color and black bg color.
  return {
    color: whiteRgb,
    backgroundColor: { ...blackRgb, a: 0.7 },
  };
}
