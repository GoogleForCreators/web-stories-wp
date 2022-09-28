/*
 * Copyright 2022 Google LLC
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
  GifResourceV42,
  ImageResourceV42,
  VideoResourceV42,
  GifElementV42,
  ImageElementV42,
  PageV42,
  ProductElementV42,
  ShapeElementV42,
  StoryV42,
  TextElementV42,
  VideoElementV42,
  UnionElementV42,
} from './v0042_removeTrackName';

export type TextElementV43 = TextElementV42;
export type ProductElementV43 = ProductElementV42;
export type ShapeElementV43 = ShapeElementV42;
export type ImageElementV43 = ImageElementV42;
export type VideoElementV43 = VideoElementV42;
export type GifElementV43 = GifElementV42;

export type ImageResourceV43 = ImageResourceV42;
export type VideoResourceV43 = VideoResourceV42;
export type GifResourceV43 = GifResourceV42;

export type UnionElementV43 =
  | ShapeElementV43
  | ImageElementV43
  | VideoElementV43
  | GifElementV43
  | TextElementV43
  | ProductElementV43;

export interface StoryV43 extends Omit<StoryV42, 'pages'> {
  pages: PageV43[];
}

export interface PageV43 extends Omit<PageV42, 'elements'> {
  elements: UnionElementV43[];
}

function removeTagNames({ pages, ...rest }: StoryV42): StoryV43 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV42): PageV43 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element: UnionElementV42): UnionElementV43 {
  if ('tagName' in element) {
    const { tagName, ...rest } = element;
    return rest;
  }
  return element;
}

export default removeTagNames;
