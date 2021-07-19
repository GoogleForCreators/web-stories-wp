/*
 * Copyright 2021 Google LLC
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
 * Normalize resource sizes to ensure numerical values for dimensions.
 *
 * @param {Object} sizes Sizes.
 * @return {Object} Normalized sizes.
 */
function normalizeResourceSizes(sizes) {
  const normalizedSizes = {};
  for (const size of Object.keys(sizes)) {
    const data = sizes[size];
    normalizedSizes[size] = {
      ...data,
      width: Number(data.width),
      height: Number(data.height),
    };
  }

  return normalizedSizes;
}

export default normalizeResourceSizes;
