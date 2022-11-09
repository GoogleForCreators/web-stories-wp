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
 * @typedef {import('@googleforcreators/types').ResourceSize} ResourceSize
 */

/**
 * @typedef {Object} PartialResourceSize
 * @property {string|number} [width] Resource width.
 * @property {string|number} [height] Resource height.
 * @property {string} mimeType Mime type.
 * @property {string} [sourceUrl] URL.
 */

/**
 * Normalize resource sizes to ensure numerical values for dimensions.
 *
 * Skips invalid sizes lacking either width or height.
 *
 * @param {Object.<string, PartialResourceSize>} sizes Sizes.
 * @return {Object.<string, ResourceSize>} Normalized sizes.
 */
function normalizeResourceSizes(sizes) {
  const normalizedSizes = {};

  if (!sizes) {
    return normalizedSizes;
  }

  for (const size of Object.keys(sizes)) {
    const data = sizes[size];

    if (!data.width || !data.height || !data.sourceUrl) {
      continue;
    }

    const width = Number(data.width);
    const height = Number(data.height);

    if (Number.isNaN(width) || Number.isNaN(height)) {
      continue;
    }

    normalizedSizes[size] = {
      ...data,
      width,
      height,
    };
  }

  return normalizedSizes;
}

export default normalizeResourceSizes;
