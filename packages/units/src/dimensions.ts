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
 * External dependencies
 */
import type {
  Element,
  ElementBox,
  MediaElement,
  ShapeElement,
} from '@googleforcreators/types';

/**
 * Internal dependencies
 */
import calcRotatedResizeOffset from './calcRotatedResizeOffset';
import {
  DANGER_ZONE_HEIGHT,
  DEFAULT_EM,
  FULLBLEED_HEIGHT,
  PAGE_HEIGHT,
  PAGE_WIDTH,
} from './constants';

/**
 * Rounds the pixel value to the max allowed precision in the "data" space.
 *
 * @param v The value to be rounded.
 * @return The value rounded to the "data" space precision.
 */
export function dataPixels(v: number): number {
  return Number(v.toFixed(0));
}

/**
 * Returns the font size in the "data" space for the specified "em" value.
 *
 * @param v The "em" value. E.g. 2 for "2em".
 * @return The font size for the specified "em" value.
 */
export function dataFontEm(v: number): number {
  return Number((v * DEFAULT_EM).toFixed(1));
}

/**
 * Rounds the pixel value to the max allowed precision in the "editor" space.
 *
 * @param v The value to be rounded.
 * @return The value rounded to the "editor" space precision.
 */
export function editorPixels(v: number): number {
  return Number(v.toFixed(5));
}

/**
 * Converts a "data" pixel value to the value in the "editor" space along
 * the horizontal (X) dimension.
 *
 * @param x The value to be converted.
 * @param pageWidth The basis value for the page's width in the "editor" space.
 * @return The value in the "editor" space.
 */
export function dataToEditorX(x: number, pageWidth: number): number {
  return editorPixels((x * pageWidth) / PAGE_WIDTH);
}

/**
 * Converts a "data" pixel value to the value in the "editor" space along
 * the vertical (Y) dimension.
 *
 * @param y The value to be converted.
 * @param pageHeight The basis value for the page's height in the "editor" space.
 * @return The value in the "editor" space.
 */
export function dataToEditorY(y: number, pageHeight: number): number {
  return editorPixels((y * pageHeight) / PAGE_HEIGHT);
}

export function dataToFontSizeY(v: number, pageHeight: number): string {
  return (dataToEditorY(v, pageHeight) / 10).toFixed(6);
}

/**
 * Converts a "editor" pixel value to the value in the "data" space along
 * the horizontal (X) dimension.
 *
 * @param x The value to be converted.
 * @param pageWidth The basis value for the page's width in the "editor" space.
 * @param [withRounding=true] Whether the dataPixels rounding should occur.
 * @return The value in the "data" space.
 */
export function editorToDataX(
  x: number,
  pageWidth: number,
  withRounding = true
): number {
  const v = (x * PAGE_WIDTH) / pageWidth;
  if (!withRounding) {
    return v;
  }
  return dataPixels(v);
}

/**
 * Converts a "editor" pixel value to the value in the "data" space along
 * the vertical (Y) dimension.
 *
 * @param y The value to be converted.
 * @param pageHeight The basis value for the page's height in the "editor" space.
 * @param [withRounding=true] Whether the dataPixels rounding should occur.
 * @return The value in the "data" space.
 */
export function editorToDataY(
  y: number,
  pageHeight: number,
  withRounding = true
): number {
  const v = (y * PAGE_HEIGHT) / pageHeight;
  if (!withRounding) {
    return v;
  }
  return dataPixels(v);
}

type ElementWithBackground = MediaElement | ShapeElement;
function elementAsBackground(
  element: Element
): element is ElementWithBackground {
  return 'isBackground' in element;
}

/**
 * Converts the element's position, width, and rotation) to the "box" in the
 * "editor" coordinate space.
 *
 * @param element The element's position, width, and rotation. See `StoryPropTypes.element`.
 * @param pageWidth The basis value for the page's width in the "editor" space.
 * @param pageHeight The basis value for the page's height in the "editor" space.
 * @return The "box" in the editor space.
 */
export function getBox(
  element: Element,
  pageWidth: number,
  pageHeight: number
): ElementBox {
  let isBackground = false;
  if (elementAsBackground(element) && element.isBackground) {
    isBackground = true;
  }

  const { x, y, width, height, rotationAngle } = element;
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
 * @param element The element object. See `StoryPropTypes.element`.
 * @param pageWidth The basis value for the page's width in the "editor" space.
 * @param pageHeight The basis value for the page's height in the "editor" space.
 * @return The "box" in the editor space.
 */
export function getBoxWithBorder(
  element: Element,
  pageWidth: number,
  pageHeight: number
): ElementBox {
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
