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
  PageV0,
  StoryV0,
  TextElementV0,
  GifElementV0,
  ImageElementV0,
  VideoElementV0,
  ShapeElementV0,
  ProductElementV0,
} from '../types';

export type PageV1 = PageV0;
export interface StoryV1 {
  pages: PageV1[];
  version?: number;
}

export type TextElementV1 = TextElementV0;
export type GifElementV1 = GifElementV0;
export type ImageElementV1 = ImageElementV0;
export type VideoElementV1 = VideoElementV0;
export type ShapeElementV1 = ShapeElementV0;
export type ProductElementV1 = ProductElementV0;

export type UnionElementV1 =
  | ShapeElementV1
  | ImageElementV1
  | VideoElementV1
  | TextElementV1;

function storyDataArrayToObject(storyData: StoryV0): StoryV1 {
  return { pages: storyData };
}

export default storyDataArrayToObject;
