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
 * External dependencies
 */
import { lerp } from '@googleforcreators/units';

/**
 * Given a media element, calculates where the origin is on the media
 * relative to it's frame, such that scaling the media up or down
 * (with the given transform-origin) most optimistically tries to
 * fill the frame
 *
 * @param {Object} offsets - story media element offsets
 * @return {Object} object containing horizontal and vertical transform origin percentages
 */
export function getMediaOrigin(
  offsets = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }
) {
  // If both offsets are 0, we want the origin to be in the middle.
  // Otherwise we want the percentage of one offset relative to the
  // other
  let vertical = 0.5;
  const absOffsets = Object.entries(offsets).reduce(
    (accum, [key, val]) => ({
      ...accum,
      [key]: Math.abs(val),
    }),
    {}
  );
  if (!(absOffsets.top < 0.01 && absOffsets.bottom < 0.01)) {
    vertical = absOffsets.top / (absOffsets.top + absOffsets.bottom);
  }
  let horizontal = 0.5;
  if (!(absOffsets.left < 0.01 && absOffsets.right < 0.01)) {
    horizontal = absOffsets.left / (absOffsets.left + absOffsets.right);
  }

  const progress = {
    vertical,
    horizontal,
  };

  return {
    horizontal: lerp(isNaN(progress.horizontal) ? 0.5 : progress.horizontal, {
      MIN: 0,
      MAX: 100,
    }),
    vertical: lerp(isNaN(progress.vertical) ? 0.5 : progress.vertical, {
      MIN: 0,
      MAX: 100,
    }),
  };
}
