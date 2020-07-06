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
 * Wrapper around the canvas getImageData API
 * Source: https://github.com/fregante/get-canvas-pixel-color
 *
 * @param  {Element|CanvasRenderingContext2D} ctx The canvas from which to take the color
 * @param  {number} x The x coordinate of the pixel to read
 * @param  {number} y The y coordinate of the pixel to read
 * @return {Array|Object} The rgb values of the read pixel
 */
function getColorFromCanvas(ctx, x, y) {
  // if it's not a context, it's probably a canvas element
  if (!ctx.getImageData) {
    ctx = ctx.getContext('2d');
  }

  // extract the pixel data from the canvas
  let pixel = ctx.getImageData(x, y, 1, 1).data;

  // set each color property
  pixel.r = pixel[0];
  pixel.g = pixel[1];
  pixel.b = pixel[2];
  pixel.a = pixel[3];

  // convenience CSS strings
  pixel.rgb = 'rgb(' + pixel.r + ',' + pixel.g + ',' + pixel.b + ')';
  pixel.rgba =
    'rgba(' + pixel.r + ',' + pixel.g + ',' + pixel.b + ',' + pixel.a + ')';

  return pixel;
}

export default getColorFromCanvas;
