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
import { useCallback } from '@googleforcreators/react';
import {
  dataPixels,
  calcRotatedObjectPositionAndSize,
  clamp,
} from '@googleforcreators/units';
import { getDefinitionForType } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */

import usePresubmitHandler from '../../../form/usePresubmitHandler';
import { MIN_MAX } from './constants';
import { isNum } from './utils';

function usePresubmitHandlers(lockAspectRatio, height, width) {
  // Recalculate width/height if ratio locked.
  usePresubmitHandler(
    (
      newElement,
      { width: newWidth, height: newHeight },
      { width: oldWidth, height: oldHeight }
    ) => {
      const { type } = newElement;

      const isResizeWidth = Boolean(newWidth);
      const isResizeHeight = Boolean(newHeight);
      if (!isResizeWidth && !isResizeHeight) {
        return null;
      }

      // Use resize rules if available.
      const { updateForResizeEvent } = getDefinitionForType(type);
      if (updateForResizeEvent) {
        const direction = [isResizeWidth ? 1 : 0, isResizeHeight ? 1 : 0];
        return updateForResizeEvent(
          newElement,
          direction,
          clamp(newWidth, MIN_MAX.WIDTH),
          clamp(newHeight, MIN_MAX.HEIGHT)
        );
      }

      // Fallback to ratio.
      if (lockAspectRatio) {
        const ratio = oldWidth / oldHeight;
        if (!isResizeWidth) {
          return {
            width: clamp(dataPixels(newHeight * ratio), MIN_MAX.WIDTH),
          };
        }
        if (!isResizeHeight) {
          return {
            height: clamp(dataPixels(newWidth / ratio), MIN_MAX.HEIGHT),
          };
        }
      }

      return null;
    },
    [lockAspectRatio]
  );

  usePresubmitHandler(({ rotationAngle: newRotationAngle }) => {
    return {
      rotationAngle: newRotationAngle % 360,
    };
  }, []);

  usePresubmitHandler(
    ({ rotationAngle: na, x: nx, y: ny, width: nw, height: nh }) => {
      const newDims = calcRotatedObjectPositionAndSize(na, nx, ny, nw, nh);
      const newXOffset = nx - newDims.x;
      const newYOffset = ny - newDims.y;
      return {
        x: clamp(nx, {
          MIN: MIN_MAX.X.MIN + newXOffset - newDims.width,
          MAX: MIN_MAX.X.MAX + newXOffset,
        }),
        y: clamp(ny, {
          MIN: MIN_MAX.Y.MIN + newYOffset - newDims.height,
          MAX: MIN_MAX.Y.MAX + newYOffset,
        }),
      };
    },
    []
  );

  const setDimensionMinMax = useCallback(
    (value, ratio, minmax) => {
      if (lockAspectRatio && value >= minmax.MAX) {
        return clamp(minmax.MAX * ratio, minmax);
      }

      return clamp(value, minmax);
    },
    [lockAspectRatio]
  );

  usePresubmitHandler(
    ({ height: newHeight }, { width: oldWidth, height: oldHeight }) => {
      const ratio = oldHeight / oldWidth;
      newHeight = clamp(newHeight, MIN_MAX.HEIGHT);
      if (isNum(ratio)) {
        return {
          height: setDimensionMinMax(
            dataPixels(newHeight),
            ratio,
            MIN_MAX.HEIGHT
          ),
        };
      }
      return {
        height: clamp(newHeight, MIN_MAX.HEIGHT),
      };
    },
    [height, lockAspectRatio]
  );

  usePresubmitHandler(
    ({ width: newWidth }, { width: oldWidth, height: oldHeight }) => {
      const ratio = oldWidth / oldHeight;
      newWidth = clamp(newWidth, MIN_MAX.WIDTH);
      if (isNum(ratio)) {
        return {
          width: setDimensionMinMax(dataPixels(newWidth), ratio, MIN_MAX.WIDTH),
        };
      }
      return {
        width: clamp(newWidth, MIN_MAX.WIDTH),
      };
    },
    [width, lockAspectRatio]
  );
}

export default usePresubmitHandlers;
