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
  GifElementV31,
  GifResourceV31,
  ImageElementV31,
  ImageResourceV31,
  PageV31,
  ProductElementV31,
  ShapeElementV31,
  StoryV31,
  TextElementV31,
  VideoElementV31,
  VideoResourceV31,
} from './v0031_normalizeResourceSizes';

export type TextElementV32 = TextElementV31;
export type ProductElementV32 = ProductElementV31;
export type ShapeElementV32 = ShapeElementV31;
export type ImageElementV32 = ImageElementV31;
export type ImageResourceV32 = ImageResourceV31;
export type VideoElementV32 = VideoElementV31;
export type VideoResourceV32 = VideoResourceV31;
export type GifElementV32 = GifElementV31;
export type GifResourceV32 = GifResourceV31;

export type UnionElementV32 =
  | ShapeElementV32
  | ImageElementV32
  | VideoElementV32
  | GifElementV32
  | TextElementV32
  | ProductElementV32;

export interface StoryV32 extends Omit<StoryV31, 'pages'> {
  pages: PageV32[];
}
export interface PageV32 extends Omit<PageV31, 'elements' | 'pageAttachment'> {
  elements: UnionElementV32[];
  pageAttachment?: {
    url: string;
    ctaText?: string;
    theme?: string;
  };
}

function pageOutlinkTheme({ pages, ...rest }: StoryV31): StoryV32 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage(page: PageV31): PageV32 {
  const { pageAttachment } = page;
  if (!pageAttachment) {
    return page;
  }

  if ('theme' in pageAttachment) {
    return page;
  }
  return {
    ...page,
    pageAttachment: {
      ...pageAttachment,
      theme: 'light',
    },
  };
}

export default pageOutlinkTheme;
