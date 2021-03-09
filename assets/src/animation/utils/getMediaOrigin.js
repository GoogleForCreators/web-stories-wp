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
 * Internal dependencies
 */
import { getMediaBoundOffsets, lerp } from '../utils';

/**
 * Given a media element, calculates where the origin is on the media
 * relative to it's frame, such that scaling the media up or down
 * (with the given transform-origin) most optimistically tries to
 * fill the frame
 *
 * @param {*} element - story media element
 * @return {Object} object containing horizontal and vertical transform origin percentages
 */
export function getMediaOrigin(element) {
  const offsets = element
    ? getMediaBoundOffsets({ element })
    : {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      };

  const progress = {
    vertical:
      Math.abs(offsets.top) /
      (Math.abs(offsets.top) + Math.abs(offsets.bottom)),
    horizontal:
      Math.abs(offsets.left) /
      (Math.abs(offsets.left) + Math.abs(offsets.right)),
  };

  return {
    horizontal: lerp(isNaN(progress.horizontal) ? 0.5 : progress.horizontal, [
      0,
      100,
    ]),
    vertical: lerp(isNaN(progress.vertical) ? 0.5 : progress.vertical, [
      0,
      100,
    ]),
  };
}
