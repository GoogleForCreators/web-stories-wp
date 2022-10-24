/*
 * Copyright 2021 Google LLC
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
  GifResourceV33,
  ImageResourceV33,
  VideoResourceV33,
  GifElementV33,
  ImageElementV33,
  PageV33,
  ProductElementV33,
  ShapeElementV33,
  StoryV33,
  TextElementV33,
  UnionElementV33,
  VideoElementV33,
} from './v0033_removeTitleFromResources';

export type TextElementV34 = TextElementV33;
export type ProductElementV34 = ProductElementV33;
export type ShapeElementV34 = ShapeElementV33;
export type ImageElementV34 = ImageElementV33;
export type VideoElementV34 = VideoElementV33;
export type GifElementV34 = GifElementV33;

export type ImageResourceV34 = ImageResourceV33;
export type VideoResourceV34 = VideoResourceV33;
export type GifResourceV34 = GifResourceV33;

export type UnionElementV34 =
  | ShapeElementV34
  | ImageElementV34
  | VideoElementV34
  | GifElementV34
  | TextElementV34
  | ProductElementV34;

export interface StoryV34 extends Omit<StoryV33, 'pages'> {
  pages: PageV34[];
}
export interface PageV34 extends Omit<PageV33, 'elements' | 'overlay'> {
  elements: UnionElementV34[];
}

function removeUnusedBackgroundProps({ pages, ...rest }: StoryV33): StoryV34 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, overlay, ...rest }: PageV33): PageV34 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element: UnionElementV33): UnionElementV34 {
  if ('isDefaultBackground' in element && element.isDefaultBackground) {
    const { backgroundColor, ...rest } = element;
    return rest;
  }

  return element;
}

export default removeUnusedBackgroundProps;
