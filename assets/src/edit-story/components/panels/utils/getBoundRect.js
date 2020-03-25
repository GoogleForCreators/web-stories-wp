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
import { dataPixels } from '../../../units/dimensions';

/**
 * Get the outer frame values for all objects in `list`, 
returns { startX, startY, endX, endY, width, height };
 
Example usage:
```
getBoundRect( [ { x: 10, y: 10, width: 100, height: 50 }, { x: 30, y: 20, width: 100, height: 50 } ] );
// returns { startX: 10, startY: 10, endX: 130, endY: 70, width: 120, height: 60 };
getBoundRect( [ { x: 10, y: 10, width: 100, height: 50 }, { x: 30, y: 20, width: 100, height: 50, rotationAngle: 45 } ] );
// returns { startX: 10, startY: -8, endX: 133, endY: 98, width: 123, height: 106 };
```
 *
 * @param {Array<Object>} list List of elements with size and position properties
 * @return {Object} Returns outer frame of all list objects
 */
function getBoundRect(list) {
  const firstElementProperties = list[0].rotationAngle
    ? calcRotatedObjectPositionAndSize(
        list[0].rotationAngle,
        list[0].x,
        list[0].y,
        list[0].width,
        list[0].height
      )
    : list[0];
  let startX = firstElementProperties.x;
  let startY = firstElementProperties.y;
  let endX = startX + firstElementProperties.width;
  let endY = startY + firstElementProperties.height;

  list.forEach((el) => {
    const elementProperties = el.rotationAngle
      ? calcRotatedObjectPositionAndSize(
          el.rotationAngle,
          el.x,
          el.y,
          el.width,
          el.height
        )
      : el;
    startX = Math.min(elementProperties.x, startX);
    startY = Math.min(elementProperties.y, startY);
    endX = Math.max(elementProperties.x + elementProperties.width, endX);
    endY = Math.max(elementProperties.y + elementProperties.height, endY);
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

export function calcRotatedObjectPositionAndSize(angle, x, y, width, height) {
  /// variables
  const centerX = x + width * 0.5;
  const centerY = y + height * 0.5;
  const radian = (angle * Math.PI) / 180;
  /// get corner coordinates
  const topLeftPoint = getCorner(centerX, centerY, x, y, radian);
  const topRightPoint = getCorner(centerX, centerY, x + width, y, radian);
  const bottomRightPoint = getCorner(
    centerX,
    centerY,
    x + width,
    y + height,
    radian
  );
  const bottomLeftPoint = getCorner(centerX, centerY, x, y + height, radian);

  /// get bounding box
  const boundTopLeftX = Math.min(
    topLeftPoint.x,
    topRightPoint.x,
    bottomRightPoint.x,
    bottomLeftPoint.x
  );
  const boundTopLeftY = Math.min(
    topLeftPoint.y,
    topRightPoint.y,
    bottomRightPoint.y,
    bottomLeftPoint.y
  );
  const boundBottomRightX = Math.max(
    topLeftPoint.x,
    topRightPoint.x,
    bottomRightPoint.x,
    bottomLeftPoint.x
  );
  const boundBottomRightY = Math.max(
    topLeftPoint.y,
    topRightPoint.y,
    bottomRightPoint.y,
    bottomLeftPoint.y
  );

  return {
    x: boundTopLeftX,
    y: boundTopLeftY,
    width: boundBottomRightX - boundTopLeftX,
    height: boundBottomRightY - boundTopLeftY,
  };
}

function getCorner(pivotX, pivotY, cornerX, cornerY, angle) {
  /// get distance from center to point
  const diffX = cornerX - pivotX;
  const diffY = cornerY - pivotY;
  const distance = Math.sqrt(diffX * diffX + diffY * diffY);

  /// find angle from pivot to corner
  angle += Math.atan2(diffY, diffX);

  /// get new x and y and round it off to integer
  const x = dataPixels(pivotX + distance * Math.cos(angle));
  const y = dataPixels(pivotY + distance * Math.sin(angle));

  return { x, y };
}

export default getBoundRect;
