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
import type { Pattern } from '../types/pattern';
import type {
  GifElementV20,
  ImageElementV20,
  PageV20,
  ProductElementV20,
  ShapeElementV20,
  StoryV20,
  TextElementV20,
  VideoElementV20,
} from './v0020_isFillDeprecate';

export type TextElementV21 = TextElementV20;
export type ProductElementV21 = ProductElementV20;
export type ShapeElementV21 = ShapeElementV20;
export type ImageElementV21 = ImageElementV20;
export type VideoElementV21 = VideoElementV20;
export type GifElementV21 = GifElementV20;

export type UnionElementV21 =
  | ShapeElementV21
  | ImageElementV21
  | VideoElementV21
  | GifElementV21
  | TextElementV21
  | ProductElementV21;

export interface StoryV21 extends Omit<StoryV20, 'pages'> {
  pages: PageV21[];
}
export interface PageV21 extends Omit<PageV20, 'elements'> {
  elements: UnionElementV21[];
  backgroundColor: Pattern;
}

function backgroundColorToPage({ pages, ...rest }: StoryV20): StoryV21 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage(page: PageV20): PageV21 {
  const { elements, defaultBackgroundElement } = page;
  const defaultBackground = {
    type: 'solid',
    color: { r: 255, g: 255, b: 255 },
  } as Pattern;
  let pageBackgroundColor;
  if (
    'isDefaultBackground' in elements[0] &&
    elements[0].isDefaultBackground &&
    elements[0].backgroundColor
  ) {
    pageBackgroundColor = elements[0].backgroundColor;
  } else {
    pageBackgroundColor = defaultBackgroundElement?.backgroundColor;
  }
  return {
    ...page,
    backgroundColor: pageBackgroundColor
      ? pageBackgroundColor
      : defaultBackground,
  };
}

export default backgroundColorToPage;
