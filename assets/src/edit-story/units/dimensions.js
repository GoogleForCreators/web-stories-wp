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
  FULLBLEED_RATIO,
  DEFAULT_EM,
} from '../constants';

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
  return dataPixels(v * DEFAULT_EM);
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

/**
 * Converts a "editor" pixel value to the value in the "data" space along
 * the horizontal (X) dimension.
 *
 * @param {number} x The value to be converted.
 * @param {number} pageWidth The basis value for the page's width in the "editor" space.
 * @return {number} The value in the "data" space.
 */
export function editorToDataX(x, pageWidth) {
  return dataPixels((x * PAGE_WIDTH) / pageWidth);
}

/**
 * Converts a "editor" pixel value to the value in the "data" space along
 * the vertical (Y) dimension.
 *
 * @param {number} y The value to be converted.
 * @param {number} pageHeight The basis value for the page's height in the "editor" space.
 * @return {number} The value in the "data" space.
 */
export function editorToDataY(y, pageHeight) {
  return dataPixels((y * PAGE_HEIGHT) / pageHeight);
}

/**
 * Converts the element's position, width, and rotation) to the "box" in the
 * "editor" coordinate space.
 *
 * @param {{x:number, y:number, width:number, height:number, rotationAngle:number, isFill:boolean}} element The
 * element's position, width, and rotation. See `StoryPropTypes.element`.
 * @param {number} pageWidth The basis value for the page's width in the "editor" space.
 * @param {number} pageHeight The basis value for the page's height in the "editor" space.
 * @return {{x:number, y:number, width:number, height:number, rotationAngle:number}} The
 * "box" in the editor space.
 */
export function getBox(
  { x, y, width, height, rotationAngle, isFill, isBackground },
  pageWidth,
  pageHeight
) {
  const displayFull = isFill || isBackground;
  return {
    x: dataToEditorX(displayFull ? 0 : x, pageWidth),
    y: dataToEditorY(
      displayFull ? -(PAGE_WIDTH / FULLBLEED_RATIO - PAGE_HEIGHT) / 2 : y,
      pageHeight
    ),
    width: dataToEditorX(displayFull ? PAGE_WIDTH : width, pageWidth),
    height: dataToEditorY(
      displayFull ? PAGE_WIDTH / FULLBLEED_RATIO : height,
      pageHeight
    ),
    rotationAngle: displayFull ? 0 : rotationAngle,
  };
}
