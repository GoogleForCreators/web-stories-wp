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
//PAGE_RATIO, FULLBLEED_RATIO
import { useUnits, PAGE_HEIGHT, PAGE_WIDTH } from '@googleforcreators/units';

function useIsPartiallyOffCanvas(selectedElement) {
  const { x, y, width, height } = selectedElement;

  const { dataToEditorX, dataToEditorY } = useUnits((state) => ({
    dataToEditorX: state.actions.dataToEditorX,
    dataToEditorY: state.actions.dataToEditorY,
  }));

  // @todo --- how to get canvas?
  // const safeZoneDiff = (canvas.width / FULLBLEED_RATIO - canvas.width / PAGE_RATIO) / 2;

  // @todo add rotation check
  let isOffCanvas = false;
  let cropWidth = width - Math.abs(x);
  let cropHeight = height - Math.abs(y); // need to calc y with safeZone
  let cropX = Math.abs(x);
  let cropY = Math.abs(y); // need to calc y with safeZone

  // if x is a negative #
  if (Number.isInteger(x) && x < 0) {
    isOffCanvas = true;
  }

  // if y is a negative #
  if (Number.isInteger(y) && y < 0) {
    isOffCanvas = true;
  }

  // check for off-canvas right side
  if (Number.isInteger(x) && x > 0) {
    cropWidth = width;
    if (x + width > PAGE_WIDTH) {
      isOffCanvas = true;
      cropX = width - (x + width - PAGE_WIDTH);
    } else {
      cropX = 0;
    }
  }

  // check if off-canvas bottom
  if (Number.isInteger(y) && y > 0) {
    cropHeight = height;
    if (y + height > PAGE_HEIGHT) {
      isOffCanvas = true;
      cropY = height - (y + height - PAGE_HEIGHT);
    } else {
      cropY = 0;
    }
  }

  cropWidth = dataToEditorX(cropWidth);
  cropHeight = dataToEditorY(cropHeight);
  cropX = dataToEditorX(cropX);
  cropY = dataToEditorY(cropY);

  return { isOffCanvas, cropParams: { cropWidth, cropHeight, cropX, cropY } };
}

export default useIsPartiallyOffCanvas;
