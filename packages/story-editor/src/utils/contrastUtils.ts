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
import type { Hex } from '@googleforcreators/patterns';

/**
 * Calculate luminance from RGB Object
 */
export function calculateLuminanceFromRGB(rgb: Hex) {
  const { r, g, b, a = 1.0 } = rgb;
  const luminance = hues.relativeLuminance({
    r: r / 255.0,
    g: g / 255.0,
    b: b / 255.0,
    a,
  });
  return luminance;
}

/**
 * Calculate luminance from style color string
 */
export function calculateLuminanceFromStyleColor(styleColor: string) {
  const rgb = hues.str2rgba(styleColor);
  return hues.relativeLuminance(rgb);
}

interface ContrastReturn {
  ratio: number;
  WCAG_AA: boolean;
}
/**
 * 18 point text or 14 point bold text is judged to be large enough to require a lower contrast ratio.
 * https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
 */
/**
 * Check contrast ratios from luminances for WCAG guidelines
 */
export function checkContrastFromLuminances(
  luminanceA: number,
  luminanceB: number,
  fontSize: number
): ContrastReturn {
  const ratio = hues.contrast(luminanceA, luminanceB);
  return { ratio, WCAG_AA: hues.aa(ratio, fontSize) };
}

type RgbArray = [number, number, number, number?];
/**
 * Calculates contrast between two rgb colors, considering font size.
 */
function calculateContrast(
  rgb1: RgbArray,
  rgb2: RgbArray,
  fontSize: number
): ContrastReturn {
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
 */
export function getAccessibleTextColorsFromPixels(
  pixelData: Uint8ClampedArray,
  fontSize: number
) {
  const white: RgbArray = [255, 255, 255, 255];
  const black: RgbArray = [0, 0, 0, 255];
  const colors: RgbArray[] = [];

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
