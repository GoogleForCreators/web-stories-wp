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
 * External dependencies
 */
import {
  DANGER_ZONE_HEIGHT,
  PAGE_HEIGHT,
  PAGE_WIDTH,
} from '@googleforcreators/units';
import { useCallback } from 'react';

function useIsPartiallyOffCanvas(selectedElement) {
  const { x, y, width, height } = selectedElement;

  // @todo this will be replaced with src/utils/isOffCanvas
  const isOffCanvas = useCallback(() => {
    let offCanvas = false;
    let offCanvasTop = 0;
    let offCanvasRight = 0;
    let offCanvasBottom = 0;
    let offCanvasLeft = 0;

    // if x is a negative #
    if (x < 0) {
      offCanvasLeft = Math.abs(x);
    }

    // We have to adjust the y value since y = 0 is the top edge of the page container, not the top edge of the fullbleed container.
    const adjustedY = y + DANGER_ZONE_HEIGHT;
    // if y is a negative #
    if (adjustedY < 0) {
      offCanvasTop = Math.abs(adjustedY);
    }

    // check for off-canvas right side
    if (x > 0) {
      if (x + width > PAGE_WIDTH) {
        offCanvasRight = x + width - PAGE_WIDTH;
      }
    } else {
      const r = width - Math.abs(x) - PAGE_WIDTH;
      offCanvasRight = r > 0 ? r : 0;
    }

    // check if off-canvas bottom
    if (adjustedY > 0) {
      if (y + height > PAGE_HEIGHT) {
        const b = Math.floor(y + height - (PAGE_HEIGHT + DANGER_ZONE_HEIGHT));
        offCanvasBottom = b > 0 ? b : 0;
      }
    } else {
      const b = height - Math.abs(y) - PAGE_HEIGHT;
      offCanvasBottom = b > 0 ? b : 0;
    }

    if (
      offCanvasTop > 0 ||
      offCanvasRight > 0 ||
      offCanvasBottom > 0 ||
      offCanvasLeft > 0
    ) {
      offCanvas = true;
    }

    return {
      offCanvas,
      offCanvasTop,
      offCanvasRight,
      offCanvasBottom,
      offCanvasLeft,
    };
  }, [x, y, width, height]);

  // @todo this will be replaced with src/utils/getCropParams
  const getCropParams = useCallback(() => {
    const { offCanvasLeft, offCanvasRight, offCanvasTop, offCanvasBottom } =
      isOffCanvas();
    const percentage = selectedElement.width / selectedElement.resource.width;
    const multiplier = 100 / (percentage * 100);
    const offCanvasX = Math.floor(
      (offCanvasLeft + offCanvasRight) * multiplier
    );
    const offCanvasY = Math.floor(
      (offCanvasTop + offCanvasBottom) * multiplier
    );
    const cropWidth = selectedElement.resource.width - offCanvasX;
    const cropHeight = selectedElement.resource.height - offCanvasY;
    const cropX = Math.floor(offCanvasLeft * multiplier);
    const cropY = Math.floor(offCanvasTop * multiplier);
    return {
      cropElement: selectedElement,
      cropWidth,
      cropHeight,
      cropX,
      cropY,
      newWidth: selectedElement.width - offCanvasLeft - offCanvasRight,
      newHeight: selectedElement.height - offCanvasTop - offCanvasBottom,
    };
  }, [selectedElement, isOffCanvas]);

  return {
    isOffCanvas,
    getCropParams,
  };
}

export default useIsPartiallyOffCanvas;
