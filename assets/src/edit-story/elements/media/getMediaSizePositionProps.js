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
 * Get props for media specifically influenced by scale and focal point.
 *
 * @param {Object} resource   Media resource.
 * @param {number} width      Original width.
 * @param {number} height     Original height.
 * @param {number} scale      Scale, 100 is the default.
 * @param {number} focalX     X axis focal point.
 * @param {number} focalY     Y axis focal point.
 * @return {Object} Media properties.
 */
function getMediaSizePositionProps(
  resource,
  width,
  height,
  scale,
  focalX,
  focalY
) {
  const ratio = width / height;
  const oRatio =
    resource.width && resource.height ? resource.width / resource.height : 1;
  scale = Math.max(scale || 100, 100);
  focalX = typeof focalX === 'number' ? focalX : 50;
  focalY = typeof focalY === 'number' ? focalY : 50;
  const mediaWidth = (oRatio <= ratio ? width : height * oRatio) * scale * 0.01;
  const mediaHeight =
    (oRatio <= ratio ? width / oRatio : height) * scale * 0.01;
  const offsetX = Math.max(
    0,
    Math.min(mediaWidth * focalX * 0.01 - width * 0.5, mediaWidth - width)
  );
  const offsetY = Math.max(
    0,
    Math.min(mediaHeight * focalY * 0.01 - height * 0.5, mediaHeight - height)
  );

  return {
    width: mediaWidth,
    height: mediaHeight,
    offsetX,
    offsetY,
    scale,
    focalX,
    focalY,
  };
}

export default getMediaSizePositionProps;
