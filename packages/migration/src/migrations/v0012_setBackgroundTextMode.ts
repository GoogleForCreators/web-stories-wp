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
  GifElementV11,
  ImageElementV11,
  PageV11,
  ProductElementV11,
  ShapeElementV11,
  StoryV11,
  TextElementV11,
  UnionElementV11,
  VideoElementV11,
} from './v0011_pageAdvancement';

export interface TextElementV12 extends TextElementV11 {
  backgroundTextMode: string;
}

export type ProductElementV12 = ProductElementV11;
export type ShapeElementV12 = ShapeElementV11;
export type ImageElementV12 = ImageElementV11;
export type VideoElementV12 = VideoElementV11;
export type GifElementV12 = GifElementV11;

export type UnionElementV12 =
  | ShapeElementV12
  | ImageElementV12
  | VideoElementV12
  | GifElementV12
  | TextElementV12
  | ProductElementV12;

export interface StoryV12 extends Omit<StoryV11, 'pages'> {
  pages: PageV12[];
}
export interface PageV12 extends Omit<PageV11, 'elements'> {
  elements: UnionElementV12[];
}

function setBackgroundTextMode({ pages, ...rest }: StoryV11): StoryV12 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV11): PageV12 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element: UnionElementV11): UnionElementV12 {
  if ('content' in element) {
    let hasBackgroundColor = false;
    if ('backgroundColor' in element) {
      hasBackgroundColor = Boolean(element.backgroundColor);
    }

    return {
      backgroundTextMode: hasBackgroundColor ? 'FILL' : 'NONE',
      ...element,
    };
  }

  return element;
}

export default setBackgroundTextMode;
