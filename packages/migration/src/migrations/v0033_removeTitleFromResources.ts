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
  GifElementV32,
  GifResourceV32,
  ImageElementV32,
  ImageResourceV32,
  PageV32,
  ProductElementV32,
  ShapeElementV32,
  StoryV32,
  TextElementV32,
  UnionElementV32,
  VideoElementV32,
  VideoResourceV32,
} from './v0032_pageOutlinkTheme';

export type TextElementV33 = TextElementV32;
export type ProductElementV33 = ProductElementV32;
export type ShapeElementV33 = ShapeElementV32;
export type ImageResourceV33 = Omit<ImageResourceV32, 'title'>;
export interface ImageElementV33 extends Omit<ImageElementV32, 'resource'> {
  resource: ImageResourceV33;
}

export type VideoResourceV33 = Omit<VideoResourceV32, 'title'>;
export interface VideoElementV33 extends Omit<VideoElementV32, 'resource'> {
  resource: VideoResourceV33;
}

export type GifResourceV33 = Omit<GifResourceV32, 'title'>;
export interface GifElementV33 extends Omit<GifElementV32, 'resource'> {
  resource: GifResourceV33;
}

export type UnionElementV33 =
  | ShapeElementV33
  | ImageElementV33
  | VideoElementV33
  | GifElementV33
  | TextElementV33
  | ProductElementV33;

export interface StoryV33 extends Omit<StoryV32, 'pages'> {
  pages: PageV33[];
}
export interface PageV33 extends Omit<PageV32, 'elements'> {
  elements: UnionElementV33[];
}

function removeTitleFromResources({ pages, ...rest }: StoryV32): StoryV33 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV32): PageV33 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element: UnionElementV32): UnionElementV33 {
  if ('resource' in element && element.resource?.title) {
    delete element.resource?.title;
  }

  return element;
}

export default removeTitleFromResources;
