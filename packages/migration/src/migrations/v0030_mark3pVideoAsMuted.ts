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
import type { ResourceV0, ResourceType } from '../types';
import type {
  GifElementV29,
  ImageElementV29,
  PageV29,
  ProductElementV29,
  ShapeElementV29,
  StoryV29,
  TextElementV29,
  UnionElementV29,
  VideoElementV29,
} from './v0029_unifyGifResources';

export type TextElementV30 = TextElementV29;
export type ProductElementV30 = ProductElementV29;
export type ShapeElementV30 = ShapeElementV29;
export type ImageElementV30 = ImageElementV29;

// @todo Should we drag resource versions along in each file? Currently, basing on ResourceV0 and extending fully per file.
export interface VideoResourceV30 extends ResourceV0 {
  poster?: string;
  posterId?: number;
  id?: number;
  type: ResourceType.Video;
  lengthFormatted?: string;
  length?: number;
  isOptimized?: boolean;
  isMuted?: boolean;
}
export interface VideoElementV30 extends Omit<VideoElementV29, 'resource'> {
  resource: VideoResourceV30;
}
export type GifElementV30 = GifElementV29;

export type UnionElementV30 =
  | ShapeElementV30
  | ImageElementV30
  | VideoElementV30
  | GifElementV30
  | TextElementV30
  | ProductElementV30;

export interface StoryV30 extends Omit<StoryV29, 'pages'> {
  pages: PageV30[];
}
export interface PageV30 extends Omit<PageV29, 'elements'> {
  elements: UnionElementV30[];
}

function mark3pVideoAsMuted({ pages, ...rest }: StoryV29): StoryV30 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV29): PageV30 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element: UnionElementV29): UnionElementV30 {
  // @todo How to make TS understand it's a video element? Assigning type: 'video' and checking that doesn't work.
  if (
    'resource' in element &&
    'id' in element.resource &&
    element.type === 'video' &&
    element.resource?.id
  ) {
    const resourceId = element.resource.id.toString();
    const isCoverrMedia = resourceId.startsWith('media/coverr');
    if (isCoverrMedia) {
      return {
        ...element,
        resource: {
          ...element.resource,
          isMuted: true,
        },
      } as VideoElementV30;
    }
  }
  return element;
}

export default mark3pVideoAsMuted;
