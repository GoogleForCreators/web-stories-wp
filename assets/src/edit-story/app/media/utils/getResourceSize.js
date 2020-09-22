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
 * Returns the best known size of the resource. The generated poster can
 * override the resource's size because the poster generation has a more
 * accurate data.
 *
 * @param {number} width Width.
 * @param {number} height Height.
 * @param {boolean} posterGenerated Whether a poster has been generated.
 * @param {number} posterWidth Poster width.
 * @param {number} posterHeight Poster height.karma-puppeteer-launcher/snapshot.cjs
 *
 * @return {Object} The resource's size (width and height).
 */
function getResourceSize(
  width,
  height,
  posterGenerated,
  posterWidth,
  posterHeight
) {
  if (posterGenerated && posterWidth && posterHeight) {
    return { width: posterWidth, height: posterHeight };
  }
  return { width, height };
}

export default getResourceSize;
