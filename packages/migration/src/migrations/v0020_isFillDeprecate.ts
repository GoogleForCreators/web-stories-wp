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
  GifElementV19,
  ImageElementV19,
  PageV19,
  ProductElementV19,
  ShapeElementV19,
  StoryV19,
  TextElementV19,
  UnionElementV19,
  VideoElementV19,
} from './v0019_conicToLinear';

export type TextElementV20 = TextElementV19;
export type ProductElementV20 = ProductElementV19;
export type ShapeElementV20 = ShapeElementV19;
export type ImageElementV20 = Omit<ImageElementV19, 'isFill'>;
export type VideoElementV20 = Omit<VideoElementV19, 'isFill'>;
export type GifElementV20 = Omit<GifElementV19, 'isFill'>;

export type UnionElementV20 =
  | ShapeElementV20
  | ImageElementV20
  | VideoElementV20
  | GifElementV20
  | TextElementV20
  | ProductElementV20;

export interface StoryV20 extends Omit<StoryV19, 'pages'> {
  pages: PageV20[];
}
export interface PageV20 extends Omit<PageV19, 'elements'> {
  elements: UnionElementV20[];
}

const PAGE_WIDTH = 440;
const PAGE_HEIGHT = 660;
const FULLBLEED_RATIO = 9 / 16;
const FULLBLEED_HEIGHT = PAGE_WIDTH / FULLBLEED_RATIO;
const DANGER_ZONE_HEIGHT = (FULLBLEED_HEIGHT - PAGE_HEIGHT) / 2;

function isFillDeprecate({ pages, ...rest }: StoryV19): StoryV20 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV19): PageV20 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element: UnionElementV19): UnionElementV20 {
  if ('isFill' in element) {
    const { isFill, ...rest } = element;
    return isFill
      ? {
          ...rest,
          x: 0,
          y: -DANGER_ZONE_HEIGHT,
          width: PAGE_WIDTH,
          height: PAGE_WIDTH / FULLBLEED_RATIO,
          rotationAngle: 0,
        }
      : rest;
  }
  return element;
}

export default isFillDeprecate;
