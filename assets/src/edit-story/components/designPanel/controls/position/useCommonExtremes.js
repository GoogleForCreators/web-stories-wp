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
 * Internal dependencies
 */
import { calcRotatedObjectPositionAndSize } from '../../../../utils/getBoundRect';
import useCommonValue from '../../useCommonValue';

function useCommonExtremes() {
  return useCommonValue(
    ['x', 'y', 'width', 'height', 'rotationAngle'],
    (aggr, { x, y, width, height, rotationAngle }) => {
      const el = calcRotatedObjectPositionAndSize(
        rotationAngle,
        x,
        y,
        width,
        height
      );
      const dx = x - el.x;
      const dy = y - el.y;
      return {
        minX: Math.max(aggr.minX, dx - el.width),
        minY: Math.max(aggr.minY, dy - el.height),
        maxX: Math.min(aggr.maxX, dx),
        maxY: Math.min(aggr.maxY, dy),
      };
    },
    {
      minX: -1e10,
      minY: -1e10,
      maxX: 1e10,
      maxY: 1e10,
    }
  );
}

export default useCommonExtremes;
