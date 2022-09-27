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
import type { LinkV0 } from '../types';
import type {
  GifElementV13,
  ImageElementV13,
  PageV13,
  ProductElementV13,
  ShapeElementV13,
  StoryV13,
  TextElementV13,
  UnionElementV13,
  VideoElementV13,
} from './v0013_videoIdToId';

export type LinkV14 = Omit<LinkV0, 'type'>;
export interface VideoElementV14 extends Omit<VideoElementV13, 'link'> {
  link?: LinkV14;
}

export interface TextElementV14 extends Omit<TextElementV13, 'link'> {
  link?: LinkV14;
}
export interface ProductElementV14 extends Omit<ProductElementV13, 'link'> {
  link?: LinkV14;
}
export interface ShapeElementV14 extends Omit<ShapeElementV13, 'link'> {
  link?: LinkV14;
}
export interface ImageElementV14 extends Omit<ImageElementV13, 'link'> {
  link?: LinkV14;
}
export interface GifElementV14 extends Omit<GifElementV13, 'link'> {
  link?: LinkV14;
}

export type UnionElementV14 =
  | ShapeElementV14
  | ImageElementV14
  | VideoElementV14
  | GifElementV14
  | TextElementV14
  | ProductElementV14;

export interface StoryV14 extends Omit<StoryV13, 'pages'> {
  pages: PageV14[];
}
export interface PageV14 extends Omit<PageV13, 'elements'> {
  elements: UnionElementV14[];
}

function oneTapLinkDeprecate({ pages, ...rest }: StoryV13): StoryV14 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV13): PageV14 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element: UnionElementV13): UnionElementV14 {
  if (element.link?.type) {
    delete element.link.type;
  }
  return element;
}

export default oneTapLinkDeprecate;
