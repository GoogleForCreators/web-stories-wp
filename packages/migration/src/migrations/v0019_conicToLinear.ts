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
import type { Linear, Pattern } from '../types/pattern';
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

export interface ShapeElementV19
  extends Omit<ShapeElementV18, 'backgroundColor'> {
  backgroundColor?: Pattern;
}
export interface TextElementV19
  extends Omit<TextElementV18, 'color' | 'backgroundColor'> {
  color: Pattern;
  backgroundColor?: Pattern;
}
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
  extends Omit<
    PageV18,
    | 'elements'
    | 'backgroundElementId'
    | 'backgroundColor'
    | 'defaultBackgroundElement'
  > {
  elements: UnionElementV19[];
  backgroundColor?: Pattern;
  defaultBackgroundElement?: ShapeElementV19;
}

function conicToLinear({ pages, ...rest }: StoryV18): StoryV19 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({
  elements,
  defaultBackgroundElement,
  ...rest
}: PageV18): PageV19 {
  const updatedDefaultBackground = defaultBackgroundElement
    ? (updateElement(defaultBackgroundElement) as ShapeElementV19)
    : undefined;
  return {
    elements: elements.map(updateElement),
    defaultBackgroundElement: updatedDefaultBackground,
    ...rest,
  };
}

function updateElement(element: UnionElementV18): UnionElementV19 {
  if ('backgroundColor' in element) {
    const { backgroundColor, ...rest } = element;
    if (!backgroundColor) {
      return {
        ...rest,
        backgroundColor: {
          color: {
            r: 196,
            g: 196,
            b: 196,
          },
        },
      };
    }
    if (backgroundColor.type === 'conic') {
      return {
        ...element,
        backgroundColor: {
          ...backgroundColor,
          type: 'linear',
        } as Linear,
      };
    }
    return element as UnionElementV19;
  }
  return element;
}

export default conicToLinear;
