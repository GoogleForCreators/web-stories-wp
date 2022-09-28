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
  GifResourceV34,
  ImageResourceV34,
  VideoResourceV34,
  GifElementV34,
  ImageElementV34,
  PageV34,
  ProductElementV34,
  ShapeElementV34,
  StoryV34,
  TextElementV34,
  UnionElementV34,
  VideoElementV34,
} from './v0034_removeUnusedBackgroundProps';

export type TextElementV35 = TextElementV34;
export type ProductElementV35 = ProductElementV34;
export type ShapeElementV35 = Omit<ShapeElementV34, 'isDefaultBackground'>;
export type ImageElementV35 = ImageElementV34;
export type VideoElementV35 = VideoElementV34;
export type GifElementV35 = GifElementV34;

export type ImageResourceV35 = ImageResourceV34;
export type VideoResourceV35 = VideoResourceV34;
export type GifResourceV35 = GifResourceV34;

export type UnionElementV35 =
  | ShapeElementV35
  | ImageElementV35
  | VideoElementV35
  | GifElementV35
  | TextElementV35
  | ProductElementV35;

export interface StoryV35 extends Omit<StoryV34, 'pages'> {
  pages: PageV35[];
}
export interface PageV35 extends Omit<PageV34, 'elements'> {
  elements: UnionElementV35[];
}

function markVideoAsExternal({ pages, ...rest }: StoryV34): StoryV35 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV34): PageV35 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element: UnionElementV34): UnionElementV35 {
  if ('resource' in element) {
    if ('id' in element.resource && element.resource.id) {
      const resourceId = element.resource.id.toString();
      const is3pMedia = resourceId.startsWith('media/');
      element.resource.isExternal = is3pMedia;
    } else {
      element.resource.isExternal = true;
    }
  }
  return element;
}

export default markVideoAsExternal;
