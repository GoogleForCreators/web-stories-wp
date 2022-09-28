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
  GifResourceV39,
  ImageResourceV39,
  VideoResourceV39,
  GifElementV39,
  ImageElementV39,
  PageV39,
  ProductElementV39,
  ShapeElementV39,
  StoryV39,
  TextElementV39,
  UnionElementV39,
  VideoElementV39,
} from './v0039_backgroundAudioFormatting';

export type TextElementV40 = TextElementV39;
export type ProductElementV40 = ProductElementV39;
export type ShapeElementV40 = ShapeElementV39;
export type ImageElementV40 = ImageElementV39;
export type VideoElementV40 = VideoElementV39;
export type GifElementV40 = GifElementV39;

export type ImageResourceV40 = ImageResourceV39;
export type VideoResourceV40 = VideoResourceV39;
export type GifResourceV40 = GifResourceV39;

export type UnionElementV40 =
  | ShapeElementV40
  | ImageElementV40
  | VideoElementV40
  | GifElementV40
  | TextElementV40
  | ProductElementV40;

export interface StoryV40 extends Omit<StoryV39, 'pages'> {
  pages: PageV40[];
}
export interface PageV40 extends Omit<PageV39, 'elements'> {
  elements: UnionElementV40[];
}

function andadaFontToAndadaPro({ pages, ...rest }: StoryV39): StoryV40 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV39): PageV40 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

const andadaPro = {
  family: 'Andada Pro',
  fallbacks: ['serif'],
  weights: [400, 500, 600, 700, 800],
  styles: ['regular', 'italic'],
  variants: [
    [0, 400],
    [0, 500],
    [0, 600],
    [0, 700],
    [0, 800],
    [1, 400],
    [1, 500],
    [1, 600],
    [1, 700],
    [1, 800],
  ],
  service: 'fonts.google.com',
  metrics: {
    upm: 1000,
    asc: 942,
    des: -235,
    tAsc: 942,
    tDes: -235,
    tLGap: 0,
    wAsc: 1100,
    wDes: 390,
    xH: 494,
    capH: 705,
    yMin: -382,
    yMax: 1068,
    hAsc: 942,
    hDes: -235,
    lGap: 0,
  },
};

function updateElement(element: UnionElementV39): UnionElementV40 {
  if ('font' in element && element.font?.family === 'Andada') {
    element.font = {
      ...element.font,
      ...andadaPro,
    };
  }
  return element;
}

export default andadaFontToAndadaPro;
