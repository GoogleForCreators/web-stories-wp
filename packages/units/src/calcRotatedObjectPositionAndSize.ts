/*
 * Copyright 2022 Google LLC
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
import getCorners from './getCorners';

export default function calcRotatedObjectPositionAndSize(
  angle = 0,
  x: number,
  y: number,
  width: number,
  height: number
) {
  if (!angle) {
    return { x, y, width, height };
  }

  const { topLeftPoint, topRightPoint, bottomRightPoint, bottomLeftPoint } =
    getCorners(angle, x, y, width, height);
  /// get bounding box
  const boundTopLeftX = Math.min(
    topLeftPoint.x,
    topRightPoint.x,
    bottomRightPoint.x,
    bottomLeftPoint.x
  );
  const boundTopLeftY = Math.min(
    topLeftPoint.y,
    topRightPoint.y,
    bottomRightPoint.y,
    bottomLeftPoint.y
  );
  const boundBottomRightX = Math.max(
    topLeftPoint.x,
    topRightPoint.x,
    bottomRightPoint.x,
    bottomLeftPoint.x
  );
  const boundBottomRightY = Math.max(
    topLeftPoint.y,
    topRightPoint.y,
    bottomRightPoint.y,
    bottomLeftPoint.y
  );

  return {
    x: boundTopLeftX,
    y: boundTopLeftY,
    width: boundBottomRightX - boundTopLeftX,
    height: boundBottomRightY - boundTopLeftY,
  };
}
