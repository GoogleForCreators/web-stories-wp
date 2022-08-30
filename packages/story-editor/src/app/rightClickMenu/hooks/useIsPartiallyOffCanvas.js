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
import { PAGE_HEIGHT, PAGE_WIDTH } from '@googleforcreators/units';

function useIsPartiallyOffCanvas(selectedElement) {
  const { x, y, width, height } = selectedElement;
  let isOffCanvas = false;
  let offCanvasTop = 0;
  let offCanvasRight = 0;
  let offCanvasBottom = 0;
  let offCanvasLeft = 0;

  // if x is a negative #
  if (x < 0) {
    offCanvasLeft = Math.abs(x);
  }

  // if y is a negative #
  if (y < 0) {
    offCanvasTop = Math.abs(y);
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
  if (y > 0) {
    if (y + height > PAGE_HEIGHT) {
      offCanvasBottom = y + height - PAGE_HEIGHT;
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
    isOffCanvas = true;
  }

  const percentage = width / selectedElement.resource.width;
  const multiplier = 100 / (percentage * 100);
  const offCanvasX = Math.floor((offCanvasLeft + offCanvasRight) * multiplier);
  const offCanvasY = Math.floor((offCanvasTop + offCanvasBottom) * multiplier);
  const cropWidth = selectedElement.resource.width - offCanvasX;
  const cropHeight = selectedElement.resource.height - offCanvasY;
  const cropX = Math.floor(offCanvasLeft * multiplier);
  const cropY = Math.floor(offCanvasTop * multiplier);

  return {
    isOffCanvas,
    cropParams: {
      cropElement: selectedElement,
      offCanvasTop,
      offCanvasRight,
      offCanvasBottom,
      offCanvasLeft,
      cropWidth,
      cropHeight,
      cropX,
      cropY,
      newWidth: width - offCanvasLeft - offCanvasRight,
      newHeight: height - offCanvasTop - offCanvasBottom,
    },
  };
}

export default useIsPartiallyOffCanvas;
