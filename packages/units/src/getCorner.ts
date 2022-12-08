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
import type { Coordinates } from './types';
import { dataPixels } from './dimensions';

function getCorner(
  pivotX: number,
  pivotY: number,
  cornerX: number,
  cornerY: number,
  angle: number
): Coordinates {
  /// get distance from center to point
  const diffX = cornerX - pivotX;
  const diffY = cornerY - pivotY;
  const distance = Math.sqrt(diffX * diffX + diffY * diffY);

  /// find angle from pivot to corner
  angle += Math.atan2(diffY, diffX);

  /// get new x and y and round it off to integer
  const x = dataPixels(pivotX + distance * Math.cos(angle));
  const y = dataPixels(pivotY + distance * Math.sin(angle));

  return { x, y };
}

export default getCorner;
