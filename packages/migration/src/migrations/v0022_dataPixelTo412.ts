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
  GifElementV21,
  ImageElementV21,
  PageV21,
  ProductElementV21,
  ShapeElementV21,
  StoryV21,
  TextElementV21,
  UnionElementV21,
  VideoElementV21,
} from './v0021_backgroundColorToPage';

export type TextElementV22 = TextElementV21;
export type ProductElementV22 = ProductElementV21;
export type ShapeElementV22 = ShapeElementV21;
export type ImageElementV22 = ImageElementV21;
export type VideoElementV22 = VideoElementV21;
export type GifElementV22 = GifElementV21;

export type UnionElementV22 =
  | ShapeElementV22
  | ImageElementV22
  | VideoElementV22
  | GifElementV22
  | TextElementV22
  | ProductElementV22;

export interface StoryV22 extends Omit<StoryV21, 'pages'> {
  pages: PageV22[];
}
export interface PageV22 extends Omit<PageV21, 'elements'> {
  elements: UnionElementV22[];
  backgroundOverlay?: string | undefined | null;
}

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

function dataPixelTo440({ pages, ...rest }: StoryV21): StoryV22 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV21): PageV22 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(props: UnionElementV21): UnionElementV22 {
  const { x, y, width, height, ...rest } = props;
  const element = {
    x: dataPixels(x * SCALE),
    y: dataPixels(y * SCALE),
    width: dataPixels(width * SCALE),
    height: dataPixels(height * SCALE),
    ...rest,
  };
  if ('fontSize' in element && typeof element.fontSize === 'number') {
    element.fontSize = dataPixels(element.fontSize * SCALE);
  }
  if ('padding' in element && element.padding) {
    const { horizontal, vertical } = element.padding;
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
