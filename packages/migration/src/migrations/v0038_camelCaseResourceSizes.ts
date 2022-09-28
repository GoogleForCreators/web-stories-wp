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
export type ImageElementV38 = ImageElementV37;
export type VideoElementV38 = VideoElementV37;
export type GifElementV38 = GifElementV37;

export type ImageResourceV38 = ImageResourceV37;
export type VideoResourceV38 = VideoResourceV37;
export type GifResourceV38 = GifResourceV37;

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

export function snakeToCamelCase(string = ''): string {
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

function snakeToCamelCaseObjectKeys(obj: Size): Size {
  return Object.entries(obj).reduce((_obj: Size, [key, value]) => {
    _obj[snakeToCamelCase(key)] = value;
    return _obj;
  }, {});
}

function updateElement(element: UnionElementV37): UnionElementV38 {
  if (
    'resource' in element &&
    'sizes' in element.resource &&
    element.resource.sizes
  ) {
    for (const [key, value] of Object.entries(element.resource.sizes)) {
      element.resource.sizes[key] = snakeToCamelCaseObjectKeys(value);
    }
  }
  return element;
}

export default camelCaseResourceSizes;
