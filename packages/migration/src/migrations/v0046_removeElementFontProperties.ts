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
  GifElementV45,
  ImageElementV45,
  PageV45,
  ProductElementV45,
  ShapeElementV45,
  StoryV45,
  TextElementV45,
  VideoElementV45,
  UnionElementV45,
} from './v0045_globalPageAdvancement';

export interface TextElementV46 extends Omit<TextElementV45, 'font'> {
  font: {
    family: string;
  };
}
export type ProductElementV46 = ProductElementV45;
export type ShapeElementV46 = ShapeElementV45;
export type ImageElementV46 = ImageElementV45;
export type VideoElementV46 = VideoElementV45;
export type GifElementV46 = GifElementV45;

export type UnionElementV46 =
  | ShapeElementV46
  | ImageElementV46
  | VideoElementV46
  | GifElementV46
  | TextElementV46
  | ProductElementV46;

export interface StoryV46 extends Omit<StoryV45, 'pages'> {
  pages: PageV46[];
}
export interface PageV46 extends Omit<PageV45, 'elements'> {
  elements: UnionElementV46[];
}

function removeElementFontProperties({ pages, ...rest }: StoryV45): StoryV46 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV45): PageV46 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element: UnionElementV45): UnionElementV46 {
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
