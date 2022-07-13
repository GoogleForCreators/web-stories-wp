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

export function getMetricsForBorder({
  newBorder,
  border,
  x,
  y,
  width,
  height,
}) {
  const { left = 0, top = 0, right = 0, bottom = 0 } = border;
  const {
    left: nLeft = left,
    top: nTop = top,
    right: nRight = right,
    bottom: nBottom = bottom,
  } = newBorder;
  return {
    width: width + (nLeft - left) + (nRight - right),
    height: height + (nTop - top) + (nBottom - bottom),
    x: x - (nLeft - left),
    y: y - (nTop - top),
  };
}
