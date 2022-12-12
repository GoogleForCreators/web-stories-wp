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
import type { MediaElement } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import type { CropParams } from '../app/media/types';
import { isOffCanvas } from './isOffCanvas';

export function getCropParams({
  x,
  y,
  width,
  height,
  rotationAngle,
  resource,
}: MediaElement): CropParams {
  const { offCanvasLeft, offCanvasRight, offCanvasTop, offCanvasBottom } =
    isOffCanvas({ x, y, width, height, rotationAngle });
  const percentage = width / resource.width;
  const multiplier = 100 / (percentage * 100);
  const offCanvasX = Math.floor((offCanvasLeft + offCanvasRight) * multiplier);
  const offCanvasY = Math.floor((offCanvasTop + offCanvasBottom) * multiplier);
  const cropWidth = resource.width - offCanvasX;
  const cropHeight = resource.height - offCanvasY;
  const cropX = Math.floor(offCanvasLeft * multiplier);
  const cropY = Math.floor(offCanvasTop * multiplier);
  return {
    cropElement: { x, y },
    cropWidth,
    cropHeight,
    cropX,
    cropY,
    newWidth: width - offCanvasLeft - offCanvasRight,
    newHeight: height - offCanvasTop - offCanvasBottom,
  };
}
