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
import {
  PAGE_WIDTH,
  PAGE_HEIGHT,
  DANGER_ZONE_HEIGHT,
  FULLBLEED_HEIGHT,
  DEFAULT_EM,
} from './constants';
import calcRotatedResizeOffset from './calcRotatedResizeOffset';

/**
 * Rounds the pixel value to the max allowed precision in the "data" space.
 *
 * @param {number} v The value to be rounded.
 * @return {number} The value rounded to the "data" space precision.
 */
export function dataPixels(v) {
  return Number(v.toFixed(0));
}

/**
 * Returns the font size in the "data" space for the specified "em" value.
 *
 * @param {number} v The "em" value. E.g. 2 for "2em".
 * @return {number} The font size for the specified "em" value.
 */
export function dataFontEm(v) {
  return Number((v * DEFAULT_EM).toFixed(1));
}

/**
 * Rounds the pixel value to the max allowed precision in the "editor" space.
 *
 * @param {number} v The value to be rounded.
 * @return {number} The value rounded to the "editor" space precision.
 */
export function editorPixels(v) {
  return Number(v.toFixed(5));
}

/**
 * Converts a "data" pixel value to the value in the "editor" space along
 * the horizontal (X) dimension.
 *
 * @param {number} x The value to be converted.
 * @param {number} pageWidth The basis value for the page's width in the "editor" space.
 * @return {number} The value in the "editor" space.
 */
export function dataToEditorX(x, pageWidth) {
  return editorPixels((x * pageWidth) / PAGE_WIDTH);
}

/**
 * Converts a "data" pixel value to the value in the "editor" space along
 * the vertical (Y) dimension.
 *
 * @param {number} y The value to be converted.
 * @param {number} pageHeight The basis value for the page's height in the "editor" space.
 * @return {number} The value in the "editor" space.
 */
export function dataToEditorY(y, pageHeight) {
  return editorPixels((y * pageHeight) / PAGE_HEIGHT);
}

export function dataToFontSizeY(v, pageHeight) {
  return (dataToEditorY(v, pageHeight) / 10).toFixed(6);
}

/**
 * Converts a "editor" pixel value to the value in the "data" space along
 * the horizontal (X) dimension.
 *
 * @param {number} x The value to be converted.
 * @param {number} pageWidth The basis value for the page's width in the "editor" space.
 * @param {boolean} [withRounding=true] Whether the dataPixels rounding should occur.
 * @return {number} The value in the "data" space.
 */
export function editorToDataX(x, pageWidth, withRounding = true) {
  const v = (x * PAGE_WIDTH) / pageWidth;
  if (withRounding === false) {
    return v;
  }
  return dataPixels(v);
}

/**
 * Converts a "editor" pixel value to the value in the "data" space along
 * the vertical (Y) dimension.
 *
 * @param {number} y The value to be converted.
 * @param {number} pageHeight The basis value for the page's height in the "editor" space.
 * @param {boolean} [withRounding=true] Whether the dataPixels rounding should occur.
 * @return {number} The value in the "data" space.
 */
export function editorToDataY(y, pageHeight, withRounding = true) {
  const v = (y * PAGE_HEIGHT) / pageHeight;
  if (withRounding === false) {
    return v;
  }
  return dataPixels(v);
}

/**
 * Converts the element's position, width, and rotation) to the "box" in the
 * "editor" coordinate space.
 *
 * @param {{x:number, y:number, width:number, height:number, rotationAngle:number}} element The
 * element's position, width, and rotation. See `StoryPropTypes.element`.
 * @param {number} pageWidth The basis value for the page's width in the "editor" space.
 * @param {number} pageHeight The basis value for the page's height in the "editor" space.
 * @return {{x:number, y:number, width:number, height:number, rotationAngle:number}} The
 * "box" in the editor space.
 */
export function getBox(
  { x, y, width, height, rotationAngle, isBackground },
  pageWidth,
  pageHeight
) {
  return {
    x: dataToEditorX(isBackground ? 0 : x, pageWidth),
    y: dataToEditorY(isBackground ? -DANGER_ZONE_HEIGHT : y, pageHeight),
    width: dataToEditorX(isBackground ? PAGE_WIDTH : width, pageWidth),
    height: dataToEditorY(isBackground ? FULLBLEED_HEIGHT : height, pageHeight),
    rotationAngle: isBackground ? 0 : rotationAngle,
  };
}

/**
 * Converts the element's position, width, border, and rotation) to the "box" in the
 * "editor" coordinate space for an element with border.
 *
 * @param {Object} element The element object. See `StoryPropTypes.element`.
 * @param {number} pageWidth The basis value for the page's width in the "editor" space.
 * @param {number} pageHeight The basis value for the page's height in the "editor" space.
 * @return {{x:number, y:number, width:number, height:number, rotationAngle:number}} The
 * "box" in the editor space.
 */
export function getBoxWithBorder(element, pageWidth, pageHeight) {
  const { rotationAngle, border } = element;
  const box = getBox(element, pageWidth, pageHeight);
  if (!border) {
    return box;
  }
  const { left = 0, right = 0, top = 0, bottom = 0 } = border;
  const [diffX, diffY] = calcRotatedResizeOffset(
    rotationAngle,
    left,
    right,
    top,
    bottom
  );

  // Since CSS border is used and the border width is not responsive,
  // the border is not included in the element's width and height,
  // and we're adding the border to the box in pixels directly.
  return {
    ...box,
    x: box.x + diffX,
    y: box.y + diffY,
    width: box.width + left + right,
    height: box.height + top + bottom,
  };
}
