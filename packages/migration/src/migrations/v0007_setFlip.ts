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
  ShapeElementV6,
  TextElementV6,
  GifElementV6,
  ProductElementV6,
  ImageElementV6,
  VideoElementV6,
  StoryV6,
  PageV6,
  UnionElementV6,
} from './v0006_colorToPattern';

interface Flip {
  vertical: boolean;
  horizontal: boolean;
}

export interface ShapeElementV7 extends ShapeElementV6 {
  flip?: Flip;
}
export interface GifElementV7 extends GifElementV6 {
  flip?: Flip;
}

export interface ImageElementV7 extends ImageElementV6 {
  flip?: Flip;
}

export interface VideoElementV7 extends VideoElementV6 {
  flip?: Flip;
}

export type TextElementV7 = TextElementV6;
export type ProductElementV7 = ProductElementV6;

export type UnionElementV7 =
  | ShapeElementV7
  | ImageElementV7
  | VideoElementV7
  | GifElementV7
  | TextElementV7
  | ProductElementV7;

export interface StoryV7 extends Omit<StoryV6, 'pages'> {
  pages: PageV7[];
}
export interface PageV7 extends Omit<PageV6, 'elements'> {
  elements: UnionElementV7[];
}

function setFlip({ pages, ...rest }: StoryV6): StoryV7 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV6): PageV7 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element: UnionElementV6): UnionElementV7 {
  // If it's a text element or already has flip set, return as is.
  if ('content' in element || 'flip' in element) {
    // Casting since if flip was set, it was already UnionElementV7.
    return element as UnionElementV7;
  }
  return {
    ...element,
    flip: {
      horizontal: false,
      vertical: false,
    },
  };
}

export default setFlip;
