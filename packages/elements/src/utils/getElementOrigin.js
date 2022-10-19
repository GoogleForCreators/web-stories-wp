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
 * Given a media element, calculates where the origin is on the media
 * relative to it's frame, such that scaling the media up or down
 * (with the given transform-origin) most optimistically tries to
 * fill the frame
 *
 * @param {Object} offsets - story media element offsets
 * @return {Object} object containing horizontal and vertical transform origin percentages
 */
function getElementOrigin(
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
  const progress = {
    vertical: 50,
    horizontal: 50,
  };
  const absOffsets = Object.fromEntries(
    Object.entries(offsets).map(([key, val]) => [key, Math.abs(val)])
  );
  const isSignificant = (val) => val >= 0.01;
  if ([absOffsets.top, absOffsets.bottom].some(isSignificant)) {
    progress.vertical =
      (100 * absOffsets.top) / (absOffsets.top + absOffsets.bottom);
  }
  if ([absOffsets.left, absOffsets.right].some(isSignificant)) {
    progress.horizontal =
      (100 * absOffsets.left) / (absOffsets.left + absOffsets.right);
  }

  return progress;
}

export default getElementOrigin;
