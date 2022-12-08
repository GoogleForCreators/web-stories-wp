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
  GifElementV44,
  ImageElementV44,
  PageV44,
  ProductElementV44,
  ShapeElementV44,
  StoryV44,
  TextElementV44,
  VideoElementV44,
  GifResourceV44,
  ImageResourceV44,
  VideoResourceV44,
} from './v0044_unusedProperties';

export type TextElementV45 = TextElementV44;
export type ProductElementV45 = ProductElementV44;
export type ShapeElementV45 = ShapeElementV44;
export type ImageElementV45 = ImageElementV44;
export type VideoElementV45 = VideoElementV44;
export type GifElementV45 = GifElementV44;

export type ImageResourceV45 = ImageResourceV44;
export type VideoResourceV45 = VideoResourceV44;
export type GifResourceV45 = GifResourceV44;

export type UnionElementV45 =
  | ShapeElementV45
  | ImageElementV45
  | VideoElementV45
  | GifElementV45
  | TextElementV45
  | ProductElementV45;

export interface StoryV45
  extends Omit<StoryV44, 'pages' | 'autoAdvance' | 'defaultPageDuration'> {
  pages: PageV45[];
  autoAdvance?: boolean;
  defaultPageDuration?: number;
}
export interface PageV45 extends Omit<PageV44, 'elements'> {
  elements: UnionElementV45[];
}

function pageAdvancement(story: StoryV44): StoryV45 {
  const { autoAdvance, defaultPageDuration, ...rest } = story;
  if (autoAdvance && defaultPageDuration === 7) {
    return rest;
  }
  return story;
}

export default pageAdvancement;
