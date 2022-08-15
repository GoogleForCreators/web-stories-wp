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

export default function resizeSvgPath(x, y, path) {
  const coords = path
    .replace(/\s*(-)/g, ' $1')
    .replace(/\s*([A-Za-z,])\s*/g, ' $1 ')
    .split(' ');
  let coordIndex = 0;
  return coords.reduce((acc, value) => {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      const scaled = coordIndex % 2 === 0 ? parsed / x : parsed / y;
      return `${acc} ${scaled.toFixed(6)}`;
    }
    coordIndex = 0;
    return `${acc} ${value}`;
  }, '');
}
