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
  let startX = list[0].x;
  let startY = list[0].y;
  let endX = list[0].x + list[0].width;
  let endY = list[0].y + list[0].height;

  list.forEach((el) => {
    if (el.x < startX) startX = el.x;
    if (el.y < startY) startY = el.y;
    const elEndX = el.x + el.width;
    const elEndY = el.y + el.height;
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

export default getBoundRect;
