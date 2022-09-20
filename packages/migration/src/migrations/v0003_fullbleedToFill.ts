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
  GifElementV0,
  ImageElementV0,
  VideoElementV0,
  ProductElementV0,
  ShapeElementV0,
  TextElementV0,
  PageV0,
} from '../types';
import type { PageV2, StoryV2, UnionElementV2 } from './v0002_dataPixelTo1080';

export interface VideoElementV3 extends Omit<VideoElementV0, 'isFullbleed'> {
  isFill?: boolean;
}

export interface GifElementV3 extends Omit<GifElementV0, 'isFullbleed'> {
  isFill?: boolean;
}

export interface ImageElementV3 extends Omit<ImageElementV0, 'isFullbleed'> {
  isFill?: boolean;
}

export type UnionElementV3 =
  | ShapeElementV0
  | ImageElementV3
  | VideoElementV3
  | TextElementV0
  | ProductElementV0;

export interface PageV3 extends Omit<PageV0, 'elements'> {
  elements: UnionElementV3[];
}

export interface StoryV3 extends Omit<StoryV2, 'pages'> {
  pages: PageV3[];
}

function fullbleedToFill({ pages, ...rest }: StoryV2): StoryV3 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV2): PageV3 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element: UnionElementV2): UnionElementV3 {
  if ('isFullbleed' in element) {
    const { isFullbleed, ...rest } = element;
    return {
      isFill: isFullbleed,
      ...rest,
    };
  }
  return element;
}

export default fullbleedToFill;
