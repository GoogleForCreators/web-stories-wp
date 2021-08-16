/*
 * Copyright 2021 Google LLC
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

const getColorIndicesForCoord = (x, y, width) => {
  const red = (Math.floor(y) * width + Math.floor(x)) * 4;
  return [red, red + 1, red + 2, red + 3];
};
function getColorFromPixelData(pixelData, x, y, width) {
  const colorIndices = getColorIndicesForCoord(x, y, width);
  const [redIndex, greenIndex, blueIndex, alphaIndex] = colorIndices;
  const r = pixelData[redIndex];
  const g = pixelData[greenIndex];
  const b = pixelData[blueIndex];
  const a = pixelData[alphaIndex] / 255;
  return { r, g, b, a };
}

export default getColorFromPixelData;
