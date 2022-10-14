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
  GifElementV43,
  ImageElementV43,
  PageV43,
  ProductElementV43,
  ShapeElementV43,
  StoryV43,
  TextElementV43,
  VideoElementV43,
} from './v0043_removeTagNames';

export type TextElementV44 = TextElementV43;
export type ProductElementV44 = ProductElementV43;
export type ShapeElementV44 = ShapeElementV43;
export type ImageElementV44 = ImageElementV43;
export type VideoElementV44 = VideoElementV43;
export type GifElementV44 = GifElementV43;

export type UnionElementV44 =
  | ShapeElementV44
  | ImageElementV44
  | VideoElementV44
  | GifElementV44
  | TextElementV44
  | ProductElementV44;

export interface StoryV44 extends Omit<StoryV43, 'pages' | 'autoAdvance' | 'defaultPageDuration'> {
  pages: PageV44[];
  autoAdvance?: boolean;
  defaultPageDuration?: number;
}
export interface PageV44 extends Omit<PageV43, 'elements'> {
  elements: UnionElementV44[];
}

function pageAdvancement(story: StoryV43): StoryV44 {
  if ('autoAdvance' in story && 'defaultPageDuration' in story) {
    const { autoAdvance, defaultPageDuration, ...rest } = story;
    if (autoAdvance && defaultPageDuration === 7) {
      return rest;
    }
  }
  return story;
}

export default pageAdvancement;
