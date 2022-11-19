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
  GifResourceV46,
  ImageResourceV46,
  VideoResourceV46,
  GifElementV46,
  ImageElementV46,
  PageV46,
  ProductElementV46,
  ShapeElementV46,
  StoryV46,
  TextElementV46,
  VideoElementV46,
  UnionElementV46,
} from './v0046_removeRedundantScalingProperties';

export interface TextElementV47 extends Omit<TextElementV46, 'font'> {
  font: {
    family: string;
  };
}

export type ProductElementV47 = ProductElementV46;
export type ShapeElementV47 = ShapeElementV46;
export type ImageElementV47 = ImageElementV46;
export type VideoElementV47 = VideoElementV46;
export type GifElementV47 = GifElementV46;

export type ImageResourceV47 = ImageResourceV46;
export type VideoResourceV47 = VideoResourceV46;
export type GifResourceV47 = GifResourceV46;

export type UnionElementV47 =
  | ShapeElementV47
  | ImageElementV47
  | VideoElementV47
  | GifElementV47
  | TextElementV47
  | ProductElementV47;

export interface StoryV47 extends Omit<StoryV46, 'pages'> {
  pages: PageV47[];
}

export interface PageV47 extends Omit<PageV46, 'elements'> {
  elements: UnionElementV47[];
}

function removeElementFontProperties({ pages, ...rest }: StoryV46): StoryV47 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV46): PageV47 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element: UnionElementV46): UnionElementV47 {
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
