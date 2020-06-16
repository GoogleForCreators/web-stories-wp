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

const NEW_PAGE_WIDTH = 412;
const NEW_PAGE_HEIGHT = 618;
const OLD_PAGE_WIDTH = 440;
const OLD_PAGE_HEIGHT = 660;

// Aspect ratio is changed, but we don't want to break ratios of existing
// elements at this point. Thus the formula here is "contain".
const SCALE = Math.min(
  NEW_PAGE_WIDTH / OLD_PAGE_WIDTH,
  NEW_PAGE_HEIGHT / OLD_PAGE_HEIGHT
);

function dataPixelTo440({ pages, ...rest }) {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }) {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement({ x, y, width, height, fontSize, padding, ...rest }) {
  const element = {
    x: dataPixels(x * SCALE),
    y: dataPixels(y * SCALE),
    width: dataPixels(width * SCALE),
    height: dataPixels(height * SCALE),
    ...rest,
  };
  if (typeof fontSize === 'number') {
    element.fontSize = dataPixels(fontSize * SCALE);
  }
  if (padding) {
    const { horizontal, vertical } = padding;
    element.padding = {
      horizontal: dataPixels(horizontal * SCALE),
      vertical: dataPixels(vertical * SCALE),
    };
  }
  return element;
}

/**
 * See `units/dimensions.js`.
 *
 * @param {number} v The value to be rounded.
 * @return {number} The value rounded to the "data" space precision.
 */
function dataPixels(v) {
  return Number(v.toFixed(0));
}

export default dataPixelTo440;
