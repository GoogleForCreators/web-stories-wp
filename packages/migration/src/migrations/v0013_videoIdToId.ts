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
import type { ResourceType } from '../types';
import type {
  GifElementV12,
  ImageElementV12,
  PageV12,
  ProductElementV12,
  ShapeElementV12,
  StoryV12,
  TextElementV12,
  UnionElementV12,
  VideoElementV12,
} from './v0012_setBackgroundTextMode';

export interface VideoElementV13 extends Omit<VideoElementV12, 'resource'> {
  resource: {
    poster?: string;
    posterId?: number;
    id?: number;
    type: ResourceType.Video;
    lengthFormatted?: string;
  };
}

export type TextElementV13 = TextElementV12;
export type ProductElementV13 = ProductElementV12;
export type ShapeElementV13 = ShapeElementV12;
export type ImageElementV13 = ImageElementV12;
export type GifElementV13 = GifElementV12;

export type UnionElementV13 =
  | ShapeElementV13
  | ImageElementV13
  | VideoElementV13
  | GifElementV13
  | TextElementV13
  | ProductElementV13;

export interface StoryV13 extends Omit<StoryV12, 'pages'> {
  pages: PageV13[];
}
export interface PageV13 extends Omit<PageV12, 'elements'> {
  elements: UnionElementV13[];
}

function videoIdToId({ pages, ...rest }: StoryV12): StoryV13 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV12): PageV13 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element: UnionElementV12): UnionElementV13 {
  if ('resource' in element && 'videoId' in element.resource) {
    const { resource } = element;
    const updatedResource = {
      ...resource,
      id: resource.videoId,
    };
    return {
      ...element,
      resource: updatedResource,
    };
  }
  return element;
}

export default videoIdToId;
