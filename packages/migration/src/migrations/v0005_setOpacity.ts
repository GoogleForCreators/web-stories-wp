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
  GifElementV4,
  ImageElementV4,
  PageV4,
  ProductElementV4,
  ShapeElementV4,
  StoryV4,
  TextElementV4,
  UnionElementV4,
  VideoElementV4,
} from './v0004_mediaElementToResource';

export interface VideoElementV5 extends VideoElementV4 {
  opacity: number;
}

export interface GifElementV5 extends GifElementV4 {
  opacity: number;
}

export interface ImageElementV5 extends ImageElementV4 {
  opacity: number;
}

export interface TextElementV5 extends TextElementV4 {
  opacity: number;
}

export interface ShapeElementV5 extends ShapeElementV4 {
  opacity: number;
}
export type ProductElementV5 = ProductElementV4;

export type UnionElementV5 =
  | ShapeElementV5
  | ImageElementV5
  | VideoElementV5
  | GifElementV5
  | TextElementV5;

export interface StoryV5 extends Omit<StoryV4, 'pages'> {
  pages: PageV5[];
}
export interface PageV5 extends Omit<PageV4, 'elements'> {
  elements: UnionElementV5[];
}

function setOpacity({ pages, ...rest }: StoryV4): StoryV5 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV4): PageV5 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element: UnionElementV4): UnionElementV5 {
  if ('opacity' in element) {
    return element;
  }
  return {
    opacity: 100,
    ...element,
  };
}

export default setOpacity;
