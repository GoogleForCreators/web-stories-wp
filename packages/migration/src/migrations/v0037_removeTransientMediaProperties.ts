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
  GifResourceV36,
  ImageResourceV36,
  VideoResourceV36,
  GifElementV36,
  ImageElementV36,
  PageV36,
  ProductElementV36,
  ShapeElementV36,
  StoryV36,
  TextElementV36,
  UnionElementV36,
  VideoElementV36,
} from './v0036_changeBaseColorToHex';

export type TextElementV37 = TextElementV36;
export type ProductElementV37 = ProductElementV36;
export type ShapeElementV37 = Omit<ShapeElementV36, 'isDefaultBackground'>;

export interface ImageResourceV37 extends ImageResourceV36 {
  isExternal?: boolean;
}
export interface VideoResourceV37 extends VideoResourceV36 {
  isExternal?: boolean;
}
export interface GifResourceV37 extends GifResourceV36 {
  isExternal?: boolean;
}

export interface ImageElementV37 extends Omit<ImageElementV36, 'resource'> {
  resource: ImageResourceV37;
}
export interface VideoElementV37 extends Omit<VideoElementV36, 'resource'> {
  resource: VideoResourceV37;
}
export interface GifElementV37 extends Omit<GifElementV36, 'resource'> {
  resource: GifResourceV37;
}

export type UnionElementV37 =
  | ShapeElementV37
  | ImageElementV37
  | VideoElementV37
  | GifElementV37
  | TextElementV37
  | ProductElementV37;

export interface StoryV37 extends Omit<StoryV36, 'pages'> {
  pages: PageV37[];
}
export interface PageV37 extends Omit<PageV36, 'elements'> {
  elements: UnionElementV37[];
}

function removeTransientMediaProperties({
  pages,
  ...rest
}: StoryV36): StoryV37 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV36): PageV37 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element: UnionElementV36): UnionElementV37 {
  if (!('resource' in element)) {
    return element;
  }

  delete element.resource.local;
  delete element.resource.isTrimming;
  delete element.resource.isTranscoding;
  delete element.resource.isMuting;

  return element;
}

export default removeTransientMediaProperties;
