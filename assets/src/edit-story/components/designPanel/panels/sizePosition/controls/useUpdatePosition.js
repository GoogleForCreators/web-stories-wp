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
import clamp from '../../../../../utils/clamp';
import { calcRotatedObjectPositionAndSize } from '../../../../../utils/getBoundRect';
import useUpdateSelection from '../../../useUpdateSelection';

import CONFIG from '../config';

function useUpdatePosition(isHorizontal) {
  const handleUpdatePosition = useUpdateSelection(
    (value) => ({ rotationAngle, x, y, width, height }) => {
      x = isHorizontal ? value : x;
      y = isHorizontal ? y : value;
      const newDims = calcRotatedObjectPositionAndSize(
        rotationAngle,
        x,
        y,
        width,
        height
      );
      const newXOffset = x - newDims.x;
      const newYOffset = y - newDims.y;
      return isHorizontal
        ? {
            x: clamp(value, {
              MIN: CONFIG.X.MIN + newXOffset - newDims.width,
              MAX: CONFIG.X.MAX + newXOffset,
            }),
          }
        : {
            y: clamp(value, {
              MIN: CONFIG.Y.MIN + newYOffset - newDims.height,
              MAX: CONFIG.Y.MAX + newYOffset,
            }),
          };
    },
    [isHorizontal]
  );
  return handleUpdatePosition;
}

export default useUpdatePosition;
