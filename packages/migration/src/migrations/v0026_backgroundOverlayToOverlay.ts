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
import type { Pattern } from '../types/pattern';
import type {
  GifElementV25,
  ImageElementV25,
  PageV25,
  ProductElementV25,
  ShapeElementV25,
  StoryV25,
  TextElementV25,
  UnionElementV25,
  VideoElementV25,
} from './v0025_singleAnimationTarget';

export type TextElementV26 = TextElementV25;
export type ProductElementV26 = ProductElementV25;

export interface ShapeElementV26
  extends Omit<ShapeElementV25, 'backgroundOverlay'> {
  overlay?: Pattern | null;
}
export interface ImageElementV26
  extends Omit<ImageElementV25, 'backgroundOverlay'> {
  overlay?: Pattern | null;
}
export interface VideoElementV26
  extends Omit<VideoElementV25, 'backgroundOverlay'> {
  overlay?: Pattern | null;
}
export interface GifElementV26
  extends Omit<GifElementV25, 'backgroundOverlay'> {
  overlay?: Pattern | null;
}

export type UnionElementV26 =
  | ShapeElementV26
  | ImageElementV26
  | VideoElementV26
  | GifElementV26
  | TextElementV26
  | ProductElementV26;

export interface StoryV26 extends Omit<StoryV25, 'pages'> {
  pages: PageV26[];
}
export interface PageV26 extends Omit<PageV25, 'elements'> {
  elements: UnionElementV26[];
}

function backgroundOverlayToOverlay({ pages, ...rest }: StoryV25): StoryV26 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV25): PageV26 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element: UnionElementV25): UnionElementV26 {
  if ('backgroundOverlay' in element) {
    const { backgroundOverlay, ...rest } = element;
    return {
      ...rest,
      overlay: backgroundOverlay,
    };
  }
  return element;
}

export default backgroundOverlayToOverlay;
