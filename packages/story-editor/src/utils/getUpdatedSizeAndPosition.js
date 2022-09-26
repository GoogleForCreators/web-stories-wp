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
import { dataPixels, calcRotatedResizeOffset } from '@googleforcreators/units';
import { calculateTextHeight } from '@googleforcreators/element-library';

/**
 * Gets updated size and position of the element if relevant properties have changed.
 *
 * @param {Object} properties Original properties.
 * @return {{x: number, y: number, height: number}} Updated values.
 */
function getUpdatedSizeAndPosition(properties) {
  const { width, height: oldHeight, rotationAngle, x, y } = properties;
  const newHeight = dataPixels(calculateTextHeight(properties, width));
  const [dx, dy] = calcRotatedResizeOffset(
    rotationAngle,
    0,
    0,
    0,
    newHeight - oldHeight
  );
  return {
    height: newHeight,
    x: dataPixels(x + dx),
    y: dataPixels(y + dy),
  };
}

export default getUpdatedSizeAndPosition;
