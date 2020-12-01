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
 * Returns the greatest common divisor for two integers. Useful for determining
 * aspect ratios without dealing with float precision issues.
 *
 * @param {number} x The left number value
 * @param {number} y The right number value
 * @return {number|null} The largest positive number that divides both x and y.
 */
export function greatestCommonDivisor(x, y) {
  return y ? greatestCommonDivisor(y, x % y) : x;
}
