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
  GifResourceV43,
  ImageResourceV43,
  VideoResourceV43,
  GifElementV43,
  ImageElementV43,
  PageV43,
  ProductElementV43,
  ShapeElementV43,
  StoryV43,
  TextElementV43,
  VideoElementV43,
  UnionElementV43,
} from './v0043_removeTagNames';

export interface TextElementV44 extends Omit<TextElementV43, 'font'> {
  font: {
    family: string;
  };
}
export type ProductElementV44 = ProductElementV43;
export type ShapeElementV44 = ShapeElementV43;
export type ImageElementV44 = ImageElementV43;
export type VideoElementV44 = VideoElementV43;
export type GifElementV44 = GifElementV43;

export type ImageResourceV44 = ImageResourceV43;
export type VideoResourceV44 = VideoResourceV43;
export type GifResourceV44 = GifResourceV43;

export type UnionElementV44 =
  | ShapeElementV44
  | ImageElementV44
  | VideoElementV44
  | GifElementV44
  | TextElementV44
  | ProductElementV44;

export interface StoryV44 extends Omit<StoryV43, 'pages'> {
  pages: PageV44[];
}
export interface PageV44 extends Omit<PageV43, 'elements'> {
  elements: UnionElementV44[];
}

function removeElementFontProperties({ pages, ...rest }: StoryV43): StoryV44 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV43): PageV44 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element: UnionElementV43): UnionElementV44 {
  if ('font' in element) {
    const { font, ...rest } = element;
    return {
      font: {
        family: font.family,
      },
      ...rest,
    };
  }
  return element;
}

export default removeElementFontProperties;
