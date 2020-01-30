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
 * Internal dependencies
 */
import {PAGE_HEIGHT, PAGE_WIDTH} from '../constants';

/**
 * Converts pixel value to percentage value based on the editor Page measurements.
 * This is necessary for responsive display in the front-end.
 *
 * @param {number} px Pixel value.
 * @param {string} axis Axis, either `x` or `y`.
 * @return {number} Value in percentage.
 */
function getPercentageFromPixels(px, axis) {
  if ('x' === axis) {
    return Number(((px / PAGE_WIDTH) * 100).toFixed(2));
  } else if ('y' === axis) {
    return Number(((px / PAGE_HEIGHT) * 100).toFixed(2));
  }
  return 0;
}

export default getPercentageFromPixels;
