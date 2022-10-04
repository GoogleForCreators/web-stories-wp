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
 * External dependencies
 */
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import type {
  GifElementV8,
  ImageElementV8,
  PageV8,
  ProductElementV8,
  ShapeElementV8,
  StoryV8,
  TextElementV8,
  VideoElementV8,
} from './v0008_paddingToObject';

export type TextElementV9 = TextElementV8;
export type ProductElementV9 = ProductElementV8;
export type ShapeElementV9 = ShapeElementV8;
export type ImageElementV9 = ImageElementV8;
export type VideoElementV9 = VideoElementV8;
export type GifElementV9 = GifElementV8;

export type UnionElementV9 =
  | ShapeElementV9
  | ImageElementV9
  | VideoElementV9
  | GifElementV9
  | TextElementV9
  | ProductElementV9;

export interface StoryV9 extends Omit<StoryV8, 'pages'> {
  pages: PageV9[];
}
export interface PageV9 extends Omit<PageV8, 'elements' | 'backgroundColor'> {
  elements: UnionElementV9[];
  backgroundElementId?: string;
}

const PAGE_WIDTH = 1080;
const DEFAULT_ELEMENT_WIDTH = PAGE_WIDTH / 3;

function defaultBackground({ pages, ...rest }: StoryV8): StoryV9 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ backgroundColor, ...rest }: PageV8): PageV9 {
  if (!('backgroundElementId' in rest)) {
    const { elements } = rest;
    const element = {
      type: 'shape',
      x: (PAGE_WIDTH / 4) * Math.random(),
      y: (PAGE_WIDTH / 4) * Math.random(),
      width: DEFAULT_ELEMENT_WIDTH,
      height: DEFAULT_ELEMENT_WIDTH,
      rotationAngle: 0,
      mask: {
        type: 'rectangle',
      },
      flip: {
        vertical: false,
        horizontal: false,
      },
      isBackground: true,
      backgroundColor: backgroundColor || {
        color: { r: 255, g: 255, b: 255, a: 1 },
      },
      id: (uuidv4 as () => string)(),
      opacity: 100,
    };
    elements.unshift(element);
    return {
      ...rest,
      elements,
      backgroundElementId: element.id,
    };
  }
  return rest;
}

export default defaultBackground;
