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
  GifResourceV0,
  ImageResourceV0,
  VideoResourceV0,
  ResourceType,
} from '../types';
import type {
  ImageElementV3,
  GifElementV3,
  VideoElementV3,
  PageV3,
  StoryV3,
  TextElementV3,
  ShapeElementV3,
  ProductElementV3,
  UnionElementV3,
} from './v0003_fullbleedToFill';

export interface VideoElementV4 extends Omit<
  VideoElementV3,
  'src' | 'origRatio' | 'mimeType' | 'videoId' | 'poster' | 'posterId'
> {
  resource: VideoResourceV0;
}

export interface GifElementV4 extends Omit<
  GifElementV3,
  'src' | 'origRatio' | 'mimeType'
> {
  resource: GifResourceV0;
}

export interface ImageElementV4 extends Omit<
  ImageElementV3,
  'src' | 'origRatio' | 'mimeType'
> {
  resource: ImageResourceV0;
}

export type TextElementV4 = TextElementV3;
export type ShapeElementV4 = ShapeElementV3;
export type ProductElementV4 = ProductElementV3;

export type UnionElementV4 =
  | ShapeElementV4
  | ImageElementV4
  | VideoElementV4
  | TextElementV4
  | GifElementV4;

export interface StoryV4 extends Omit<StoryV3, 'pages'> {
  pages: PageV4[];
}
export interface PageV4 extends Omit<PageV3, 'elements'> {
  elements: UnionElementV4[];
}

function dataMediaElementToResource({ pages, ...rest }: StoryV3): StoryV4 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV3): PageV4 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element: UnionElementV3): UnionElementV4 {
  if ('mimeType' in element) {
    if ('videoId' in element) {
      const {
        src,
        origRatio,
        poster,
        posterId,
        videoId,
        mimeType,
        width,
        height,
        ...rest
      } = element;
      return {
        resource: {
          type: 'video' as ResourceType.Video,
          src,
          width,
          height,
          poster,
          posterId,
          videoId,
          mimeType,
        },
        width,
        height,
        ...rest,
      };
    } else if (element.type === 'image') {
      const { src, origRatio, width, height, mimeType, ...rest } = element;
      return {
        resource: {
          type: 'image' as ResourceType.Image,
          src,
          width,
          height,
          mimeType,
        },
        width,
        height,
        ...rest,
      };
    }
  }
  return element as UnionElementV4;
}

export default dataMediaElementToResource;
