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
  ResourceV0,
  ResourceType,
} from '../types';
import type {
  ImageElementV3,
  GifElementV3,
  VideoElementV3,
  PageV3,
  StoryV3,
  ElementV3,
  TextElementV3,
  MediaElementV3,
} from './v0003_fullbleedToFill';

// @todo This is less commonly used type in migration, as the other resource types, should we still carry these along through all files?
export type ResourceV4 = ResourceV0;

export interface MediaElementV4 extends MediaElementV3 {
  resource: ResourceV0;
}

export interface VideoElementV4
  extends Omit<VideoElementV3, 'src' | 'origRatio' | 'mimeType'> {
  resource: VideoResourceV0;
}

export interface GifElementV4
  extends Omit<GifElementV3, 'src' | 'origRatio' | 'mimeType'> {
  resource: GifResourceV0;
}

export interface ImageElementV4
  extends Omit<ImageElementV3, 'src' | 'origRatio' | 'mimeType'> {
  resource: ImageResourceV0;
}

export type ElementV4 = ElementV3;
export type PageV4 = PageV3;
export type StoryV4 = StoryV3;
export type TextElementV4 = TextElementV3;

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

function isMediaElement(element: ElementV3): element is MediaElementV3 {
  return 'mimeType' in element;
}

function updateElement(element: ElementV3): ElementV4 {
  if (isMediaElement(element)) {
    if (element.type === 'image') {
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
      } as ElementV4;
    } else if ('videoId' in element) {
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
      } = element as VideoElementV3;
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
      } as ElementV4;
    }
  }
  return element;
}

export default dataMediaElementToResource;
