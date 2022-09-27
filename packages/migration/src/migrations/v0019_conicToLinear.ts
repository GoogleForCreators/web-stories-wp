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
import type { Linear } from '../types/pattern';
import type {
  GifElementV18,
  ImageElementV18,
  PageV18,
  ProductElementV18,
  ShapeElementV18,
  StoryV18,
  TextElementV18,
  UnionElementV18,
  VideoElementV18,
} from './v0018_defaultBackgroundElement';

export type ShapeElementV19 = ShapeElementV18;
export type TextElementV19 = TextElementV18;
export type ProductElementV19 = ProductElementV18;
export type ImageElementV19 = ImageElementV18;
export type VideoElementV19 = VideoElementV18;
export type GifElementV19 = GifElementV18;

export type UnionElementV19 =
  | ShapeElementV19
  | ImageElementV19
  | VideoElementV19
  | GifElementV19
  | TextElementV19
  | ProductElementV19;

export interface StoryV19 extends Omit<StoryV18, 'pages'> {
  pages: PageV19[];
}
export interface PageV19
  extends Omit<PageV18, 'elements' | 'backgroundElementId'> {
  elements: UnionElementV19[];
}

function conicToLinear({ pages, ...rest }: StoryV18): StoryV19 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV18): PageV19 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element: UnionElementV18): UnionElementV19 {
  if ('backgroundColor' in element) {
    if (!element.backgroundColor) {
      return element;
    }
    const { backgroundColor } = element;
    if (backgroundColor.type === 'conic') {
      return {
        ...element,
        backgroundColor: {
          ...backgroundColor,
          type: 'linear',
        } as Linear,
      };
    }
    return element;
  }
  return element;
}

export default conicToLinear;
