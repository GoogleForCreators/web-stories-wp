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
import { MIN_MAX } from './constants';

export function getReducedValue(items, key, smallest = true) {
  return items.reduce((val, el) => {
    if (smallest && el[key] < val) {
      return el;
    } else if (!smallest && el[key] > val) {
      return el;
    }
    return val;
  });
}

export function getMultiSelectionMinMaxXY(selectedElements) {
  // Gets all real dimensions of the selected elements.
  const allDimensions = selectedElements.map((element) => {
    return calcRotatedObjectPositionAndSize(
      element.rotationAngle,
      element.x,
      element.y,
      element.width,
      element.height
    );
  });

  return selectedElements.reduce((values, element, i) => {
    const actualDimensions = allDimensions[i];
    const xOffset = element.x - actualDimensions.x;
    const yOffset = element.y - actualDimensions.y;
    const minX = MIN_MAX.X.MIN + xOffset - actualDimensions.width;
    const minY = MIN_MAX.Y.MIN + yOffset - actualDimensions.height;
    const maxX = MIN_MAX.X.MAX + xOffset;
    const maxY = MIN_MAX.Y.MAX + yOffset;
    // For min values: get min value for each element and choose the highest.
    // For max values: get max value for each and choose the lowest.
    return {
      minX: values.minX ? Math.max(values.minX, minX) : minX,
      minY: values.minY ? Math.max(values.minY, minY) : minY,
      maxX: values.maxX ? Math.min(values.maxX, maxX) : maxX,
      maxY: values.maxY ? Math.min(values.maxY, maxY) : maxY,
    };
  }, {});
}

export function isNum(v) {
  return typeof v === 'number' && !isNaN(v);
}
