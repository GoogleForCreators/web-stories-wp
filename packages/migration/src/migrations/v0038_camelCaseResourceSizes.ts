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
  GifResourceV37,
  ImageResourceV37,
  VideoResourceV37,
  GifElementV37,
  ImageElementV37,
  PageV37,
  ProductElementV37,
  ShapeElementV37,
  StoryV37,
  TextElementV37,
  UnionElementV37,
  VideoElementV37,
} from './v0037_removeTransientMediaProperties';

export type TextElementV38 = TextElementV37;
export type ProductElementV38 = ProductElementV37;
export type ShapeElementV38 = Omit<ShapeElementV37, 'isDefaultBackground'>;

export interface ImageResourceV38 extends Omit<ImageResourceV37, 'sizes'> {
  sizes: Record<string, CamelCaseSize>;
}
export interface VideoResourceV38 extends Omit<VideoResourceV37, 'sizes'> {
  sizes: Record<string, CamelCaseSize>;
}
export interface GifResourceV38 extends Omit<GifResourceV37, 'sizes'> {
  sizes: Record<string, CamelCaseSize>;
}

export interface ImageElementV38 extends Omit<ImageElementV37, 'resource'> {
  resource: ImageResourceV38;
}
export interface VideoElementV38 extends Omit<VideoElementV37, 'resource'> {
  resource: VideoResourceV38;
}
export interface GifElementV38 extends Omit<GifElementV37, 'resource'> {
  resource: GifResourceV38;
}

export type UnionElementV38 =
  | ShapeElementV38
  | ImageElementV38
  | VideoElementV38
  | GifElementV38
  | TextElementV38
  | ProductElementV38;

interface Size {
  file: string;
  source_url: string;
  mime_type: string;
  width: number;
  height: number;
}

interface CamelCaseSize {
  [index: string]: string | number;
  file: string;
  sourceUrl: string;
  mimeType: string;
  width: number;
  height: number;
}

export interface StoryV38 extends Omit<StoryV37, 'pages'> {
  pages: PageV38[];
}
export interface PageV38 extends Omit<PageV37, 'elements'> {
  elements: UnionElementV38[];
}

function camelCaseResourceSizes({ pages, ...rest }: StoryV37): StoryV38 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV37): PageV38 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function snakeToCamelCase(string = ''): string {
  if (!string.includes('_') && !string.includes('-')) {
    return string;
  }

  return string
    .toLowerCase()
    .replace(
      /([a-z])([_|-][a-z])/g,
      (_match, group1: string, group2: string) =>
        group1 + group2.toUpperCase().replace('_', '').replace('-', '')
    );
}

type Key = keyof CamelCaseSize;
function snakeToCamelCaseObjectKeys(obj: Size): CamelCaseSize {
  return Object.entries(obj).reduce(
    (_obj: CamelCaseSize, [key, value]: [string, string | number]) => {
      _obj[snakeToCamelCase(key) as Key] = value;
      return _obj;
    },
    {} as CamelCaseSize
  );
}

function updateElement(element: UnionElementV37): UnionElementV38 {
  if (
    'resource' in element &&
    'sizes' in element.resource &&
    element.resource.sizes
  ) {
    const sizes: Record<string, CamelCaseSize> = {};
    for (const [key, value] of Object.entries(element.resource.sizes)) {
      sizes[key] = snakeToCamelCaseObjectKeys(value as Size);
    }
    return {
      ...element,
      resource: {
        ...element.resource,
        sizes,
      },
    };
  }
  return element as UnionElementV38;
}

export default camelCaseResourceSizes;
