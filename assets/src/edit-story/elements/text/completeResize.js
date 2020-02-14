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
import { MIN_FONT_SIZE, MAX_FONT_SIZE } from '../../constants';
import {
  calculateFitTextFontSize,
  calculateTextHeight,
} from '../../utils/textMeasurements';
import { dataPixels } from '../../units/dimensions';

function completeResize(element, newWidth, newHeight) {
  const { width, height } = element;
  const isResizingWidth = Math.abs(newWidth - width) >= 1;
  const isResizingHeight = Math.abs(newHeight - height) >= 1;

  // Diagonal resizing w/keep ratio.
  if (isResizingWidth && isResizingHeight) {
    return {
      fontSize: dataPixels(
        calculateFitTextFontSize(
          element,
          newWidth,
          newHeight,
          MIN_FONT_SIZE,
          MAX_FONT_SIZE
        )
      ),
    };
  }

  // Width-only resize: recalc height.
  if (isResizingWidth) {
    return { height: dataPixels(calculateTextHeight(element, newWidth)) };
  }

  return null;
}

export default completeResize;
