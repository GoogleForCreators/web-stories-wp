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
  GifElementV26,
  ImageElementV26,
  PageV26,
  ProductElementV26,
  ShapeElementV26,
  StoryV26,
  TextElementV26,
  UnionElementV26,
  VideoElementV26,
} from './v0026_backgroundOverlayToOverlay';

export type TextElementV27 = TextElementV26;
export type ProductElementV27 = ProductElementV26;
export type ShapeElementV27 = ShapeElementV26;
export type ImageElementV27 = ImageElementV26;
export interface VideoElementV27 extends Omit<VideoElementV26, 'resource'> {
  resource: {
    poster?: string;
    posterId?: number;
    id?: number;
    type: ResourceType.Video;
    lengthFormatted?: string;
    length?: number;
  };
}
export type GifElementV27 = GifElementV26;

export type UnionElementV27 =
  | ShapeElementV27
  | ImageElementV27
  | VideoElementV27
  | GifElementV27
  | TextElementV27
  | ProductElementV27;

export interface StoryV27 extends Omit<StoryV26, 'pages'> {
  pages: PageV27[];
}
export interface PageV27 extends Omit<PageV26, 'elements'> {
  elements: UnionElementV27[];
}

function videoDuration({ pages, ...rest }: StoryV26): StoryV27 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV26): PageV27 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element: UnionElementV26): UnionElementV27 {
  if (
    'resource' in element &&
    element.resource.type === ('video' as ResourceType.Video) &&
    element.resource &&
    element.resource.lengthFormatted
  ) {
    let length = 0;
    const times = element.resource.lengthFormatted.split(':');
    const timesNumbers = times.map(Number);
    if (timesNumbers.length === 2) {
      const [minutes, seconds] = timesNumbers;
      length = 60 * minutes + seconds;
    } else if (timesNumbers.length === 3) {
      const [hours, minutes, seconds] = timesNumbers;
      length = 60 * 60 * hours + 60 * minutes + seconds;
    }
    const { resource } = element;
    return {
      ...element,
      resource: {
        ...resource,
        length,
      },
    };
  }
  return element;
}

export default videoDuration;
