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
import getCorner from './getCorner';
import { Corner, Corners } from './types';

function getCorners(
  angle: number,
  x: number,
  y: number,
  width: number,
  height: number
): Corners {
  /// variables
  const centerX = x + width * 0.5;
  const centerY = y + height * 0.5;
  const radian = (angle * Math.PI) / 180;
  /// get corner coordinates
  const topLeftPoint = getCorner(centerX, centerY, x, y, radian);
  const topRightPoint = getCorner(centerX, centerY, x + width, y, radian);
  const bottomRightPoint = getCorner(
    centerX,
    centerY,
    x + width,
    y + height,
    radian
  );
  const bottomLeftPoint = getCorner(centerX, centerY, x, y + height, radian);
  return {
    [Corner.TopLeft]: topLeftPoint,
    [Corner.TopRight]: topRightPoint,
    [Corner.BottomRight]: bottomRightPoint,
    [Corner.BottomLeft]: bottomLeftPoint,
  };
}

export default getCorners;
