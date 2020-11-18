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
 * Linear interpolation function.
 *
 * Takes a normalized progress value and a range in the form of a tuple
 * and returns the interpolated progress within the given range.
 *
 * @param {number} progress - value between 0 and 1
 * @param {[number, number]} range - tuple that dictates a range between 2 numbers
 *
 * @return {number} value within given range
 */
export const lerp = (progress, range) =>
  (1 - progress) * range[0] + progress * range[1];

/**
 * Takes a value and a range in the form of a tuple and clamps
 * the value to that range.
 *
 * @param {number} v - value to be clamped
 * @param {[number, number]} range - range in the form of a tuple
 *
 * @return {number} - number within range
 */
export const clamp = (v, range) => {
  const lowerBound = Math.min(range[0], range[1]);
  const upperBound = Math.max(range[0], range[1]);

  return Math.min(Math.max(lowerBound, v), upperBound);
};

/**
 * Takes a value and a range in the form of the tuple and returns
 * a normalized progress value of that value within the range.
 *
 * ```js
 * const p = progress(25, [0, 50]);
 * console.log(p) // .5
 * ```
 *
 * @param {*} v - value in range
 * @param {*} range - range in the form of a tuple
 *
 * @return {number} - progress value in the range [0, 1]
 */
export const progress = (v, range) => {
  const clamped = clamp(v, range);
  const delta = clamped - range[0];
  const difference = range[1] - range[0];

  return Math.abs(delta / difference);
};
