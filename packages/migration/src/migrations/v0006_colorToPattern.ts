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
import { parseToRgb } from 'polished';

/**
 * Internal dependencies
 */
import type { Pattern } from '../types/pattern';
import type {
  GifElementV5,
  ImageElementV5,
  PageV5,
  ProductElementV5,
  ShapeElementV5,
  StoryV5,
  TextElementV5,
  UnionElementV5,
  VideoElementV5,
} from './v0005_setOpacity';

export interface TextElementV6
  extends Omit<TextElementV5, 'color' | 'backgroundColor'> {
  color: Pattern | null;
  backgroundColor: Pattern | null;
}

export interface ShapeElementV6
  extends Omit<ShapeElementV5, 'backgroundColor'> {
  backgroundColor?: Pattern | null;
}
export type GifElementV6 = GifElementV5;
export type ProductElementV6 = ProductElementV5;
export type ImageElementV6 = ImageElementV5;
export type VideoElementV6 = VideoElementV5;

export type UnionElementV6 =
  | ShapeElementV6
  | ImageElementV6
  | VideoElementV6
  | GifElementV6
  | TextElementV6
  | ProductElementV6;

export interface StoryV6 extends Omit<StoryV5, 'pages'> {
  pages: PageV6[];
}
export interface PageV6 extends Omit<PageV5, 'elements' | 'backgroundColor'> {
  elements: UnionElementV6[];
  backgroundColor: Pattern | null;
}

function colorToPattern({ pages, ...rest }: StoryV5): StoryV6 {
  return {
    pages: pages.map(updatePage),
    ...rest,
  };
}

function updatePage({ elements, backgroundColor, ...rest }: PageV5): PageV6 {
  return {
    elements: elements.map(updateElement),
    backgroundColor: parse(backgroundColor),
    ...rest,
  };
}

function updateElement(element: UnionElementV5): UnionElementV6 {
  const newProps: Record<string, null | Pattern> = {};

  if ('color' in element) {
    newProps.color = parse(element.color);
  }

  if ('backgroundColor' in element) {
    newProps.backgroundColor = parse(element.backgroundColor);
  }

  return {
    ...element,
    ...newProps,
  } as UnionElementV6;
}

function parse(colorString: string | undefined): Pattern | null {
  if (!colorString || colorString === 'transparent') {
    return null;
  }
  const colorObject = parseToRgb(colorString);
  const { red: r, green: g, blue: b } = colorObject;
  if ('alpha' in colorObject && colorObject.alpha !== 1) {
    const { alpha: a } = colorObject;
    return { color: { r, g, b, a } };
  }
  return { color: { r, g, b } };
}

export default colorToPattern;
