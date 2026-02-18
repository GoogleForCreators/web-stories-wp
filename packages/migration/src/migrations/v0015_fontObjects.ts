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
  GifElementV14,
  ImageElementV14,
  PageV14,
  ProductElementV14,
  ShapeElementV14,
  StoryV14,
  TextElementV14,
  UnionElementV14,
  VideoElementV14,
} from './v0014_oneTapLinkDeprecate';

export interface TextElementV15 extends Omit<
  TextElementV14,
  'fontFamily' | 'fontFallback'
> {
  font: {
    service: string;
    family: string;
    fallbacks: string[];
    id?: string;
    name?: string;
    value?: string;
  };
}

export type ProductElementV15 = ProductElementV14;
export type ShapeElementV15 = ShapeElementV14;
export type ImageElementV15 = ImageElementV14;
export type VideoElementV15 = VideoElementV14;
export type GifElementV15 = GifElementV14;

export type UnionElementV15 =
  | ShapeElementV15
  | ImageElementV15
  | VideoElementV15
  | GifElementV15
  | TextElementV15
  | ProductElementV15;

export interface StoryV15 extends Omit<StoryV14, 'pages'> {
  pages: PageV15[];
}
export interface PageV15 extends Omit<PageV14, 'elements'> {
  elements: UnionElementV15[];
}

function fontObjects({ pages, ...rest }: StoryV14): StoryV15 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV14): PageV15 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

const SYSTEM_FONTS = [
  'Arial',
  'Arial Black',
  'Arial Narrow',
  'Baskerville',
  'Brush Script MT',
  'Copperplate',
  'Courier New',
  'Century Gothic',
  'Garamond',
  'Georgia',
  'Gill Sans',
  'Lucida Bright',
  'Lucida Sans Typewriter',
  'Palatino',
  'Papyrus',
  'Tahoma',
  'Times New Roman',
  'Trebuchet MS',
  'Verdana',
];

function updateElement(element: UnionElementV14): UnionElementV15 {
  if (!('fontFamily' in element)) {
    return element;
  }

  const { fontFamily, fontFallback, ...rest } = element;
  const isSystemFont = SYSTEM_FONTS.includes(fontFamily);

  return {
    font: {
      service: isSystemFont ? 'system' : 'fonts.google.com',
      family: fontFamily,
      fallbacks: fontFallback,
    },
    ...rest,
  };
}

export default fontObjects;
