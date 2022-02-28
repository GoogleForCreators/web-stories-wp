/*
 * Copyright 2022 Google LLC
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
 * @param {Object} range - tuple that dictates a range between 2 numbers
 * @return {number} value within given range
 */
export const lerp = (progress, range) =>
  (1 - progress) * range.MIN + progress * range.MAX;

/**
 * Takes a value and a range in the form of the tuple and returns
 * a normalized progress value of that value within the range.
 *
 * ```js
 * const p = progress(25, {MIN: 0, MAX: 50});
 * console.log(p) // .5
 * ```
 *
 * @param {*} v - value in range
 * @param {*} range - range in the form of a tuple
 * @return {number} - progress value in the range [0, 1]
 */
export const progress = (v, range) => {
  const clamped = clamp(v, range);
  const delta = clamped - range.MIN;
  const difference = range.MAX - range.MIN;

  return Math.abs(delta / difference);
};

/**
 * Takes a value and a range in the form of a tuple and clamps the value to that range.
 *
 * @param {number} value Value to be clamped.
 * @param {Object} range Range.
 * @param {number} range.MIN Minimum value.
 * @param {number} range.MAX Maximum value.
 * @return {number} Number within range.
 */
export const clamp = (value, { MIN, MAX }) => {
  return Math.min(Math.max(value, MIN), MAX);
};
