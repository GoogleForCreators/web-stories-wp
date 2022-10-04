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
  StoryV1,
  PageV1,
  TextElementV1,
  GifElementV1,
  ImageElementV1,
  VideoElementV1,
  ShapeElementV1,
  ProductElementV1,
  UnionElementV1,
} from './v0001_storyDataArrayToObject';

const NEW_PAGE_WIDTH = 1080;
const NEW_PAGE_HEIGHT = 1920;
const OLD_PAGE_WIDTH = 412;
const OLD_PAGE_HEIGHT = 732;

const SCALE_X = NEW_PAGE_WIDTH / OLD_PAGE_WIDTH;
const SCALE_Y = NEW_PAGE_HEIGHT / OLD_PAGE_HEIGHT;

export type TextElementV2 = TextElementV1;
export type GifElementV2 = GifElementV1;
export type ImageElementV2 = ImageElementV1;
export type VideoElementV2 = VideoElementV1;
export type ShapeElementV2 = ShapeElementV1;
export type ProductElementV2 = ProductElementV1;

export type UnionElementV2 =
  | ShapeElementV2
  | ImageElementV2
  | VideoElementV2
  | TextElementV2;

export interface StoryV2 extends Omit<StoryV1, 'pages'> {
  pages: PageV2[];
}
export interface PageV2 extends Omit<PageV1, 'elements'> {
  elements: UnionElementV2[];
}

function dataPixelTo1080({ pages, ...rest }: StoryV1): StoryV2 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV1): PageV2 {
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
}: UnionElementV1): UnionElementV2 {
  const element = {
    x: dataPixels(x * SCALE_X),
    y: dataPixels(y * SCALE_Y),
    width: dataPixels(width * SCALE_X),
    height: dataPixels(height * SCALE_Y),
    ...rest,
  };
  if ('fontSize' in element && typeof element.fontSize === 'number') {
    element.fontSize = dataPixels(element.fontSize * SCALE_Y);
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

export default dataPixelTo1080;
