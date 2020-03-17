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
 * Get the bound rect value for all objects in `list`,
 *
 * ```
 *
 * @param {Array.<Object>} list  List of objects
 * @return {any} Returns common value or empty string if not similar
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
    if (elementProperties.x < startX) startX = elementProperties.x;
    if (elementProperties.y < startY) startY = elementProperties.y;
    const elEndX = elementProperties.x + elementProperties.width;
    const elEndY = elementProperties.y + elementProperties.height;
    if (elEndX > endX) endX = elEndX;
    if (elEndY > endY) endY = elEndY;
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

/**
 * Calculates the position of a rotated shape.
 *
 * @param {number} angle The rotation angle in degrees.
 * @param {number} x The resize delta on the left.
 * @param {number} y The resize delta on the right.
 * @param {number} width The resize delta on the top.
 * @param {number} height The resize delta on the bottom.
 * @return {Object} The new positions object.
 */
export function calcRotatedObjectPositionAndSize(angle, x, y, width, height) {
  /// variables
  const px = x + width * 0.5;
  const py = y + height * 0.5;
  const ar = (angle * Math.PI) / 180;
  /// get corner coordinates
  const c1 = getCorner(px, py, x, y, ar);
  const c2 = getCorner(px, py, x + width, y, ar);
  const c3 = getCorner(px, py, x + width, y + height, ar);
  const c4 = getCorner(px, py, x, y + height, ar);

  /// get bounding box
  const bx1 = Math.min(c1.x, c2.x, c3.x, c4.x);
  const by1 = Math.min(c1.y, c2.y, c3.y, c4.y);
  const bx2 = Math.max(c1.x, c2.x, c3.x, c4.x);
  const by2 = Math.max(c1.y, c2.y, c3.y, c4.y);

  return {
    x: bx1,
    y: by1,
    width: bx2 - bx1,
    height: by2 - bx1,
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
  const x = pivotX + distance * Math.cos(angle);
  const y = pivotY + distance * Math.sin(angle);

  return { x, y };
}

export default getBoundRect;
