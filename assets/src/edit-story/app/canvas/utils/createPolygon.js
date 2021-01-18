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
import SAT from 'sat';

/**
 * Internal dependencies
 */
import { getCorners } from '../../../utils/getBoundRect';

export default function createPolygon(rotationAngle, x, y, width, height) {
  const {
    topLeftPoint,
    topRightPoint,
    bottomRightPoint,
    bottomLeftPoint,
  } = getCorners(rotationAngle, x, y, width, height);
  return new SAT.Polygon(new SAT.Vector(), [
    new SAT.Vector(topLeftPoint.x, topLeftPoint.y),
    new SAT.Vector(bottomLeftPoint.x, bottomLeftPoint.y),
    new SAT.Vector(bottomRightPoint.x, bottomRightPoint.y),
    new SAT.Vector(topRightPoint.x, topRightPoint.y),
  ]);
}
