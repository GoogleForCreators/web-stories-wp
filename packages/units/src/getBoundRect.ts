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
import calcRotatedObjectPositionAndSize from './calcRotatedObjectPositionAndSize';
import type { ElementBox } from './types';

/**
 * Get the outer frame values for all objects in `list`,
 * returns { startX, startY, endX, endY, width, height };
 * Example usage:
```
getBoundRect( [ { x: 10, y: 10, width: 100, height: 50 }, { x: 30, y: 20, width: 100, height: 50 } ] );
// returns { startX: 10, startY: 10, endX: 130, endY: 70, width: 120, height: 60 };
getBoundRect( [ { x: 10, y: 10, width: 100, height: 50 }, { x: 30, y: 20, width: 100, height: 50, rotationAngle: 45 } ] );
// returns { startX: 10, startY: -8, endX: 133, endY: 98, width: 123, height: 106 };
```
 *
 * @param list List of elements with size and position properties
 * @return Returns outer frame of all list objects
 */
function getBoundRect(list: ElementBox[]) {
  const updatedList = list.map((el) =>
    calcRotatedObjectPositionAndSize(
      el.rotationAngle,
      el.x,
      el.y,
      el.width,
      el.height
    )
  );
  const firstElement = updatedList[0];
  let startX = firstElement.x;
  let startY = firstElement.y;
  let endX = startX + firstElement.width;
  let endY = startY + firstElement.height;

  updatedList.slice(1).forEach((el) => {
    startX = Math.min(el.x, startX);
    startY = Math.min(el.y, startY);
    endX = Math.max(el.x + el.width, endX);
    endY = Math.max(el.y + el.height, endY);
  });
  return {
    startX,
    startY,
    endX,
    endY,
    width: endX - startX,
    height: endY - startY,
  };
}

export default getBoundRect;
