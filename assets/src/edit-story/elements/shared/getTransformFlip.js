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
  let transformFlip = null;
  if (!flip) {
    return transformFlip;
  }
  if (flip.vertical && flip.horizontal) {
    transformFlip = 'scale3d(-1, -1, 1)';
  } else if (flip.horizontal) {
    transformFlip = 'scale3d(-1, 1, 1)';
  } else if (flip.vertical) {
    transformFlip = 'scale3d(1, -1, 1)';
  }
  return transformFlip;
}

export default getTransformFlip;
