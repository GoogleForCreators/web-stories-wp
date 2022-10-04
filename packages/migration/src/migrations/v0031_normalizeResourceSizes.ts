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
import type { ResourceV0 } from '../types';
import type {
  GifElementV30,
  ImageElementV30,
  PageV30,
  ProductElementV30,
  ShapeElementV30,
  StoryV30,
  TextElementV30,
  UnionElementV30,
  VideoElementV30,
  VideoResourceV30,
} from './v0030_mark3pVideoAsMuted';
import type { GifResourceV29 } from './v0029_unifyGifResources';

interface Size {
  width: number;
  height: number;
  source_url: string;
}
export interface ResourceV31 extends Omit<ResourceV0, 'sizes'> {
  sizes: Record<string, Size>;
}

export type TextElementV31 = TextElementV30;
export type ProductElementV31 = ProductElementV30;
export type ShapeElementV31 = ShapeElementV30;
export type ImageResourceV31 = ResourceV31;
export interface ImageElementV31 extends Omit<ImageElementV30, 'resource'> {
  resource: ImageResourceV31;
}

export interface VideoResourceV31 extends Omit<VideoResourceV30, 'sizes'> {
  sizes: Record<string, Size>;
}
export interface VideoElementV31 extends Omit<VideoElementV30, 'resource'> {
  resource: VideoResourceV31;
}

export interface GifResourceV31 extends Omit<GifResourceV29, 'resource'> {
  sizes: Record<string, Size>;
}
export interface GifElementV31 extends Omit<GifElementV30, 'resource'> {
  resource: GifResourceV31;
}

export type UnionElementV31 =
  | ShapeElementV31
  | ImageElementV31
  | VideoElementV31
  | GifElementV31
  | TextElementV31
  | ProductElementV31;

export interface StoryV31 extends Omit<StoryV30, 'pages'> {
  pages: PageV31[];
}
export interface PageV31 extends Omit<PageV30, 'elements'> {
  elements: UnionElementV31[];
}

function normalizeResourceSizes({ pages, ...rest }: StoryV30): StoryV31 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV30): PageV31 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element: UnionElementV30): UnionElementV31 {
  if ('resource' in element) {
    element.resource.width = Number(element.resource.width);
    element.resource.height = Number(element.resource.height);

    if ('sizes' in element.resource && element.resource.sizes) {
      for (const size of Object.keys(element.resource.sizes)) {
        // Disable reason: not acting on untrusted user input.
        const data = element.resource.sizes[size];
        element.resource.sizes[size] = {
          ...data,
          width: Number(data.width),
          height: Number(data.height),
        };
      }
    }
  }

  return element as UnionElementV31;
}

export default normalizeResourceSizes;
