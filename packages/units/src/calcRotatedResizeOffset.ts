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
 * Calculates the position offset [dx, dy] for a resized rotated shape.
 * The resizing can be done on four sides: left, right, top, and bottom.
 *
 * @param degree The rotation angle in degrees.
 * @param left The resize delta on the left.
 * @param right The resize delta on the right.
 * @param top The resize delta on the top.
 * @param bottom The resize delta on the bottom.
 * @return The offsets in a [dx, dy] array.
 */
function calcRotatedResizeOffset(
  degree: number,
  left: number,
  right: number,
  top: number,
  bottom: number
): [number, number] {
  const rad = (degree * Math.PI) / 180.0;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const dcx = ((right - left) * cos + (top - bottom) * sin) / 2;
  const dcy = ((bottom - top) * cos + (right - left) * sin) / 2;

  const dx = dcx - (right + left) / 2;
  const dy = dcy - (bottom + top) / 2;

  return [dx, dy];
}

export default calcRotatedResizeOffset;
