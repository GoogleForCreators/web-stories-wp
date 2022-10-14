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
  GifElementV10,
  ImageElementV10,
  PageV10,
  ProductElementV10,
  ShapeElementV10,
  StoryV10,
  TextElementV10,
  VideoElementV10,
} from './v0010_dataPixelTo440';

export type TextElementV11 = TextElementV10;
export type ProductElementV11 = ProductElementV10;
export type ShapeElementV11 = ShapeElementV10;
export type ImageElementV11 = ImageElementV10;
export type VideoElementV11 = VideoElementV10;
export type GifElementV11 = GifElementV10;

export type UnionElementV11 =
  | ShapeElementV11
  | ImageElementV11
  | VideoElementV11
  | GifElementV11
  | TextElementV11
  | ProductElementV11;

export interface StoryV11 extends Omit<StoryV10, 'pages'> {
  pages: PageV11[];
  autoAdvance: boolean;
  defaultPageDuration: number;
}
export interface PageV11 extends Omit<PageV10, 'elements'> {
  elements: UnionElementV11[];
}

function pageAdvancement(story: StoryV10): StoryV11 {
  if ('autoAdvance' in story && 'defaultPageDuration' in story) {
    return story as StoryV11;
  }
  return {
    autoAdvance: true,
    defaultPageDuration: 7,
    ...story,
  };
}

export default pageAdvancement;
