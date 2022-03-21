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
 * Returns transform scale value based on the flip setting.
 *
 * @param {Object} flip Flip value.
 * @return {string} CSS transform scale value.
 */
function getTransformFlip(flip) {
  // If no flip
  if (!flip || (!flip.horizontal && !flip.vertical)) {
    return null;
  }

  const xSign = flip.horizontal ? '-' : '';
  const ySign = flip.vertical ? '-' : '';
  return `scale3d(${xSign}1, ${ySign}1, 1)`;
}

export default getTransformFlip;
