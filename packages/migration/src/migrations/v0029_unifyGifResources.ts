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
import type { ResourceType, ResourceV0 } from '../types';
import type {
  GifElementV28,
  ImageElementV28,
  PageV28,
  ProductElementV28,
  ShapeElementV28,
  StoryV28,
  TextElementV28,
  UnionElementV28,
  VideoElementV28,
} from './v0028_mark3pVideoAsOptimized';

export type TextElementV29 = TextElementV28;
export type ProductElementV29 = ProductElementV28;
export type ShapeElementV29 = ShapeElementV28;
export type ImageElementV29 = ImageElementV28;
export type VideoElementV29 = VideoElementV28;

export interface GifResourceV29 extends ResourceV0 {
  type: ResourceType.Gif;
  output: {
    mimeType: string;
    src: string;
  };
  isTrimming?: boolean;
  isTranscoding?: boolean;
  isMuting?: boolean;
  title: string;
  isOptimized?: boolean;
  posterId: string;
  poster?: string;
  id: string;
}
export interface GifElementV29 extends Omit<GifElementV28, 'resource'> {
  resource: GifResourceV29;
}

export type UnionElementV29 =
  | ShapeElementV29
  | ImageElementV29
  | VideoElementV29
  | GifElementV29
  | TextElementV29
  | ProductElementV29;

export interface StoryV29 extends Omit<StoryV28, 'pages'> {
  pages: PageV29[];
}
export interface PageV29 extends Omit<PageV28, 'elements'> {
  elements: UnionElementV29[];
}

function unifyGifResources({ pages, ...rest }: StoryV28): StoryV29 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV28): PageV29 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element: UnionElementV28): UnionElementV29 {
  if (!('resource' in element)) {
    return element;
  }

  if (element.resource.type !== ('gif' as ResourceType.Gif)) {
    return element as UnionElementV29;
  }

  if ('id' in element.resource && 'posterId' in element.resource) {
    return element as UnionElementV29;
  }

  const { sizes, poster, ...output } = element.resource.output;
  return {
    ...element,
    resource: {
      ...element.resource,
      id: element.resource.alt,
      posterId: element.resource.alt,
      poster: element.resource.output?.poster
        ? element.resource.output.poster
        : undefined,
      isOptimized: true,
      output,
    },
  };
}

export default unifyGifResources;
