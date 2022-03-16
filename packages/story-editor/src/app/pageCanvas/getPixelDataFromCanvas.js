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
import { FULLBLEED_RATIO, getBox, PAGE_RATIO } from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import { calculateTextHeight } from '../../utils/textMeasurements';

function getPixelDataFromCanvas(canvas, attrs) {
  const ctx = canvas.getContext('2d');
  // The canvas does not consider danger zone as y = 0, so we need to adjust that.
  const safeZoneDiff =
    (canvas.width / FULLBLEED_RATIO - canvas.width / PAGE_RATIO) / 2;
  const box = getBox(
    {
      ...attrs,
      height: attrs.height
        ? attrs.height
        : calculateTextHeight(attrs, attrs.width),
    },
    canvas.width,
    canvas.height - 2 * safeZoneDiff
  );
  const { x, y: origY, width, height } = box;
  const y = origY + safeZoneDiff;
  const pixelData = ctx.getImageData(x, y, width, height).data;
  return pixelData;
}

export default getPixelDataFromCanvas;
