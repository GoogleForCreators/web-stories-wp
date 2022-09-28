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
  GifResourceV40,
  ImageResourceV40,
  VideoResourceV40,
  GifElementV40,
  ImageElementV40,
  PageV40,
  ProductElementV40,
  ShapeElementV40,
  StoryV40,
  TextElementV40,
  UnionElementV40,
  VideoElementV40,
} from './v0040_andadaFontToAndadaPro';

export interface TextElementV41 extends Omit<TextElementV40, 'font'> {
  font: {
    service: string;
    family: string;
    fallbacks: string[];
  };
}
export type ProductElementV41 = ProductElementV40;
export type ShapeElementV41 = ShapeElementV40;
export type ImageElementV41 = ImageElementV40;
export type VideoElementV41 = VideoElementV40;
export type GifElementV41 = GifElementV40;

export type ImageResourceV41 = ImageResourceV40;
export type VideoResourceV41 = VideoResourceV40;
export type GifResourceV41 = GifResourceV40;

export type UnionElementV41 =
  | ShapeElementV41
  | ImageElementV41
  | VideoElementV41
  | GifElementV41
  | TextElementV41
  | ProductElementV41;

export interface StoryV41 extends Omit<StoryV40, 'pages'> {
  pages: PageV41[];
}
export interface PageV41 extends Omit<PageV40, 'elements'> {
  elements: UnionElementV41[];
}

function removeFontProperties({ pages, ...rest }: StoryV40): StoryV41 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV40): PageV41 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element: UnionElementV40): UnionElementV41 {
  if ('font' in element) {
    const { id, name, value, ...newFontFormatted } = element.font;
    element.font = newFontFormatted;
  }
  return element;
}

export default removeFontProperties;
