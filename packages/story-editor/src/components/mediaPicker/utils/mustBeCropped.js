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
 * Return whether the image must be cropped, based on required dimensions.
 *
 * @param {boolean} flexW Flexible width.
 * @param {boolean} flexH Flexible height.
 * @param {number}  dstW Destination width.
 * @param {number}  dstH Destination height.
 * @param {number}  imgW Image Width.
 * @param {number}  imgH Image height.
 * @return {boolean} Whether or not an image must be cropped or not.
 */
const mustBeCropped = (flexW, flexH, dstW, dstH, imgW, imgH) => {
  if (true === flexW && true === flexH) {
    return false;
  }

  if (true === flexW && dstH === imgH) {
    return false;
  }

  if (true === flexH && dstW === imgW) {
    return false;
  }

  if (dstW === imgW && dstH === imgH) {
    return false;
  }

  // Skip cropping of the image's aspect ratio is the same as the required aspect ratio.
  if (Math.abs(dstW / dstH - imgW / imgH) < Number.EPSILON) {
    return false;
  }

  return true;
};
export default mustBeCropped;
