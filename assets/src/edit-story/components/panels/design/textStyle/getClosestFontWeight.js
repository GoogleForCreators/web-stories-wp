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
 * Returns a number representing closest available font weight to previously selected.
 *
 * @param {number} existingWeight previously selected font weight value to get as close to as possible, defaults to 400 (normal).
 * @param {Array<string>} availableWeights available font weights for newly selected font.
 * @return {number} Closest font weight available for given font.
 */

const DEFAULT_FONT_WEIGHT = 400;

function getClosestFontWeight(
  existingWeight = DEFAULT_FONT_WEIGHT,
  availableWeights
) {
  existingWeight = parseInt(existingWeight);
  // if the passed in existing weight is "(multiple)" we want to reset the value for the new font family in use
  if (isNaN(parseInt(existingWeight))) {
    return DEFAULT_FONT_WEIGHT;
  }

  if (!availableWeights || availableWeights.length === 0) {
    return existingWeight;
  }

  return availableWeights.reduce((a, b) => {
    a = parseInt(a);
    b = parseInt(b);

    const aDiff = Math.abs(a - existingWeight);
    const bDiff = Math.abs(b - existingWeight);

    if (aDiff === bDiff) {
      return a < b ? a : b;
    }

    return bDiff < aDiff ? b : a;
  });
}

export default getClosestFontWeight;
