/*
 * Copyright 2021 Google LLC
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
  GifResourceV35,
  ImageResourceV35,
  VideoResourceV35,
  GifElementV35,
  ImageElementV35,
  PageV35,
  ProductElementV35,
  ShapeElementV35,
  StoryV35,
  TextElementV35,
  UnionElementV35,
  VideoElementV35,
} from './v0035_markVideoAsExternal';

export type TextElementV36 = TextElementV35;
export type ProductElementV36 = ProductElementV35;
export type ShapeElementV36 = Omit<ShapeElementV35, 'isDefaultBackground'>;
export interface ImageResourceV36 extends Omit<ImageResourceV35, 'baseColor'> {
  baseColor?: string;
}
export interface VideoResourceV36 extends Omit<VideoResourceV35, 'baseColor'> {
  baseColor?: string;
}
export interface GifResourceV36 extends Omit<GifResourceV35, 'baseColor'> {
  baseColor?: string;
}

export interface ImageElementV36 extends Omit<ImageElementV35, 'resource'> {
  resource: ImageResourceV36;
}
export interface VideoElementV36 extends Omit<VideoElementV35, 'resource'> {
  resource: VideoResourceV36;
}
export interface GifElementV36 extends Omit<GifElementV35, 'resource'> {
  resource: GifResourceV36;
}

export type UnionElementV36 =
  | ShapeElementV36
  | ImageElementV36
  | VideoElementV36
  | GifElementV36
  | TextElementV36
  | ProductElementV36;

export interface StoryV36 extends Omit<StoryV35, 'pages'> {
  pages: PageV36[];
}
export interface PageV36 extends Omit<PageV35, 'elements'> {
  elements: UnionElementV36[];
}

function changeBaseColorToHex({ pages, ...rest }: StoryV35): StoryV36 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV35): PageV36 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function getHexFromSolidArray(baseColor: number[]): string {
  const color = baseColor
    .map((n) => n.toString(16))
    .map((s) => s.padStart(2, '0'))
    .join('');
  return `#${color}`;
}

function updateElement(element: UnionElementV35): UnionElementV36 {
  if (!('resource' in element)) {
    return element;
  }
  if (
    'baseColor' in element.resource &&
    Array.isArray(element.resource.baseColor)
  ) {
    return {
      ...element,
      resource: {
        ...element.resource,
        baseColor: getHexFromSolidArray(element?.resource?.baseColor),
      },
    };
  }
  return element as UnionElementV36;
}

export default changeBaseColorToHex;
