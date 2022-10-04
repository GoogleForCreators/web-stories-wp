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
  GifElementV7,
  ImageElementV7,
  PageV7,
  ProductElementV7,
  ShapeElementV7,
  StoryV7,
  TextElementV7,
  VideoElementV7,
  UnionElementV7,
} from './v0007_setFlip';

interface Padding {
  horizontal: number;
  vertical: number;
}

export interface TextElementV8 extends Omit<TextElementV7, 'padding'> {
  padding: Padding;
}
export type ProductElementV8 = ProductElementV7;
export type ShapeElementV8 = ShapeElementV7;
export type ImageElementV8 = ImageElementV7;
export type VideoElementV8 = VideoElementV7;
export type GifElementV8 = GifElementV7;

export type UnionElementV8 =
  | ShapeElementV8
  | ImageElementV8
  | VideoElementV8
  | GifElementV8
  | TextElementV8
  | ProductElementV8;

export interface StoryV8 extends Omit<StoryV7, 'pages'> {
  pages: PageV8[];
}
export interface PageV8 extends Omit<PageV7, 'elements'> {
  elements: UnionElementV8[];
}

function paddingToObject({ pages, ...rest }: StoryV7): StoryV8 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV7): PageV8 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element: UnionElementV7): UnionElementV8 {
  if (!('content' in element)) {
    return element;
  }

  const { padding } = element;
  if (
    padding &&
    Object.prototype.hasOwnProperty.call(element.padding, 'vertical') &&
    Object.prototype.hasOwnProperty.call(element.padding, 'horizontal')
  ) {
    // If padding is already set, just return as is.
    return element as UnionElementV8;
  }

  const newPadding = padding || 0;
  return {
    ...element,
    padding: {
      horizontal: newPadding,
      vertical: newPadding,
    },
  };
}

export default paddingToObject;
