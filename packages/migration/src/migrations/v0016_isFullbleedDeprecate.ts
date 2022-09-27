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
  GifElementV15,
  ImageElementV15,
  PageV15,
  ProductElementV15,
  ShapeElementV15,
  StoryV15,
  TextElementV15,
  UnionElementV15,
  VideoElementV15,
} from './v0015_fontObjects';

export type TextElementV16 = TextElementV15;
export type ProductElementV16 = ProductElementV15;
export type ShapeElementV16 = ShapeElementV15;
export type ImageElementV16 = Omit<ImageElementV15, 'isFullbleedBackground'>;
export type VideoElementV16 = Omit<VideoElementV15, 'isFullbleedBackground'>;
export type GifElementV16 = Omit<GifElementV15, 'isFullbleedBackground'>;

export type UnionElementV16 =
  | ShapeElementV16
  | ImageElementV16
  | VideoElementV16
  | GifElementV16
  | TextElementV16
  | ProductElementV16;

export interface StoryV16 extends Omit<StoryV15, 'pages'> {
  pages: PageV16[];
}
export interface PageV16 extends Omit<PageV15, 'elements'> {
  elements: UnionElementV16[];
}

function isFullbleedDeprecate({ pages, ...rest }: StoryV15): StoryV16 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV15): PageV16 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element: UnionElementV15): UnionElementV16 {
  if ('isFullbleedBackground' in element) {
    delete element.isFullbleedBackground;
  }
  return element;
}

export default isFullbleedDeprecate;
