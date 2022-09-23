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
import type {
  GifElementV9,
  ImageElementV9,
  PageV9,
  ProductElementV9,
  ShapeElementV9,
  StoryV9,
  TextElementV9,
  UnionElementV9,
  VideoElementV9,
} from './v0009_defaultBackground';

export type TextElementV10 = TextElementV9;
export type ProductElementV10 = ProductElementV9;
export type ShapeElementV10 = ShapeElementV9;
export type ImageElementV10 = ImageElementV9;
export type VideoElementV10 = VideoElementV9;
export type GifElementV10 = GifElementV9;

export type UnionElementV10 =
  | ShapeElementV10
  | ImageElementV10
  | VideoElementV10
  | GifElementV10
  | TextElementV10
  | ProductElementV10;

export interface StoryV10 extends Omit<StoryV9, 'pages'> {
  pages: PageV10[];
}
export interface PageV10 extends Omit<PageV9, 'elements'> {
  elements: UnionElementV10[];
}

const NEW_PAGE_WIDTH = 440;
const NEW_PAGE_HEIGHT = 660;
const OLD_PAGE_WIDTH = 1080;
const OLD_PAGE_HEIGHT = 1920;

// Aspect ratio is changed, but we don't want to break ratios of existing
// elements at this point. Thus the formula here is "contain".
const SCALE = Math.min(
  NEW_PAGE_WIDTH / OLD_PAGE_WIDTH,
  NEW_PAGE_HEIGHT / OLD_PAGE_HEIGHT
);

function dataPixelTo440({ pages, ...rest }: StoryV9): StoryV10 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV9): PageV10 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement({
  x,
  y,
  width,
  height,
  ...rest
}: UnionElementV9): UnionElementV10 {
  const element = {
    x: dataPixels(x * SCALE),
    y: dataPixels(y * SCALE),
    width: dataPixels(width * SCALE),
    height: dataPixels(height * SCALE),
    ...rest,
  };
  if ('fontSize' in element) {
    const { fontSize } = element;
    if (typeof fontSize === 'number') {
      element.fontSize = dataPixels(fontSize * SCALE);
    }
  }

  if ('padding' in element && element.padding) {
    const { padding } = element;
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
 * @param v The value to be rounded.
 * @return The value rounded to the "data" space precision.
 */
function dataPixels(v: number) {
  return Number(v.toFixed(0));
}

export default dataPixelTo440;
