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
 * Choose the source URL of the smallest available size image wider than
 * minWidth, according to the device pixel ratio.
 *
 * @param {number} minWidth The minimum width of the thumbnail to return.
 * @param {*} resource Image resource object.
 * @return {string} Source URL of the smallest available size image.
 */
function getThumbnailUrl(minWidth, resource) {
  const getOrientation = (obj) => {
    if (obj.width / obj.height > 1) {
      return Orientation.LANDSCAPE;
    } else if (obj.width / obj.height < 1) {
      return Orientation.PORTRAIT;
    }
    return Orientation.SQUARE;
  };

  const Orientation = {
    PORTRAIT: 'portrait',
    LANDSCAPE: 'landscape',
    SQUARE: 'square',
  };

  if (resource.sizes) {
    const smallestValidImage = Object.values(resource.sizes)
      .sort((s1, s2) => s1.width - s2.width)
      .filter((s) => getOrientation(s) === getOrientation(resource))
      .find((s) => s.width >= minWidth * window.devicePixelRatio);
    if (smallestValidImage) {
      return smallestValidImage.source_url;
    }
  }
  return resource.src;
}

export default getThumbnailUrl;
