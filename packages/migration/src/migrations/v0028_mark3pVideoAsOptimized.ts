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
import type { ResourceType } from '../types';
import type {
  GifElementV27,
  ImageElementV27,
  PageV27,
  ProductElementV27,
  ShapeElementV27,
  StoryV27,
  TextElementV27,
  UnionElementV27,
  VideoElementV27,
} from './v0027_videoDuration';

export type TextElementV28 = TextElementV27;
export type ProductElementV28 = ProductElementV27;
export type ShapeElementV28 = ShapeElementV27;
export type ImageElementV28 = ImageElementV27;
export type GifElementV28 = GifElementV27;

export interface VideoElementV28 extends Omit<VideoElementV27, 'resource'> {
  resource: {
    poster?: string;
    posterId?: number;
    id?: number;
    type: ResourceType.Video;
    lengthFormatted?: string;
    length?: number;
    isOptimized?: boolean;
  };
}

export type UnionElementV28 =
  | ShapeElementV28
  | ImageElementV28
  | VideoElementV28
  | GifElementV28
  | TextElementV28
  | ProductElementV28;

export interface StoryV28 extends Omit<StoryV27, 'pages'> {
  pages: PageV28[];
}
export interface PageV28 extends Omit<PageV27, 'elements'> {
  elements: UnionElementV28[];
}

function mark3pVideoAsOptimized({ pages, ...rest }: StoryV27): StoryV28 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV27): PageV28 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element: UnionElementV27): UnionElementV28 {
  if (
    'resource' in element &&
    element.resource.type === ('video' as ResourceType.Video) &&
    element.resource?.id
  ) {
    const resourceId = element.resource.id.toString();
    const isCoverrMedia = resourceId.startsWith('media/coverr');
    if (isCoverrMedia) {
      return {
        ...element,
        resource: {
          ...element.resource,
          isOptimized: true,
        },
      };
    }
  }
  return element;
}

export default mark3pVideoAsOptimized;
