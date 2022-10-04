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
  GifElementV23,
  ImageElementV23,
  PageV23,
  ProductElementV23,
  ShapeElementV23,
  StoryV23,
  TextElementV23,
  UnionElementV23,
  VideoElementV23,
} from './v0023_convertOverlayPattern';

export type TextElementV24 = TextElementV23;
export type ProductElementV24 = ProductElementV23;
export type ShapeElementV24 = ShapeElementV23;
export type ImageElementV24 = ImageElementV23;
export type VideoElementV24 = VideoElementV23;
export type GifElementV24 = GifElementV23;

export type UnionElementV24 =
  | ShapeElementV24
  | ImageElementV24
  | VideoElementV24
  | GifElementV24
  | TextElementV24
  | ProductElementV24;

export interface StoryV24 extends Omit<StoryV23, 'pages'> {
  pages: PageV24[];
}
export interface PageV24 extends Omit<PageV23, 'elements'> {
  elements: UnionElementV24[];
}

function blobsToSingleBlob({ pages, ...rest }: StoryV23): StoryV24 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV23): PageV24 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element: UnionElementV23): UnionElementV24 {
  if (element?.mask?.type && element?.mask?.type.startsWith('blob-')) {
    element.mask.type = 'blob';
  }
  return element;
}

export default blobsToSingleBlob;
