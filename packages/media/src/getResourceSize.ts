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
 * External dependencies
 */
import { FULLBLEED_HEIGHT, PAGE_WIDTH } from '@googleforcreators/units';

interface ResourceSizeParams {
  width?: number;
  height?: number;
  posterGenerated?: boolean;
  posterWidth?: number;
  posterHeight?: number;
}

interface ResourceSize {
  width: number;
  height: number;
}

/**
 * Returns the best known size of the resource. The generated poster can
 * override the resource's size because the poster generation has a more
 * accurate data.
 *
 * @param obj An object with height/width params.
 * @param obj.width Width.
 * @param obj.height Height.
 * @param [obj.posterGenerated] Whether a poster has been generated.
 * @param [obj.posterWidth] Poster width.
 * @param [obj.posterHeight] Poster height.
 * @return The resource's size (width and height).
 */
function getResourceSize({
  width,
  height,
  posterGenerated,
  posterWidth,
  posterHeight,
}: ResourceSizeParams): ResourceSize {
  // Use poster image size, if poster is generated.
  if (posterGenerated && posterWidth && posterHeight) {
    return { width: posterWidth, height: posterHeight };
  }
  // If height / width is set, then use them.
  if (width || height) {
    return { width: width ?? 0, height: height ?? 0 };
  }

  // Return a default height and width.
  return {
    width: PAGE_WIDTH,
    height: FULLBLEED_HEIGHT,
  };
}

export default getResourceSize;
