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
 * External dependencies
 */
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import type { AnimationV0 } from '../types';
import type {
  GifElementV24,
  ImageElementV24,
  PageV24,
  ProductElementV24,
  ShapeElementV24,
  StoryV24,
  TextElementV24,
  VideoElementV24,
} from './v0024_blobsToSingleBlob';

export type TextElementV25 = TextElementV24;
export type ProductElementV25 = ProductElementV24;
export type ShapeElementV25 = ShapeElementV24;
export type ImageElementV25 = ImageElementV24;
export type VideoElementV25 = VideoElementV24;
export type GifElementV25 = GifElementV24;

export type UnionElementV25 =
  | ShapeElementV25
  | ImageElementV25
  | VideoElementV25
  | GifElementV25
  | TextElementV25
  | ProductElementV25;

export interface StoryV25 extends Omit<StoryV24, 'pages'> {
  pages: PageV25[];
}
export interface PageV25 extends Omit<PageV24, 'elements'> {
  elements: UnionElementV25[];
}

function singleAnimationTarget({ pages, ...rest }: StoryV24): StoryV25 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ animations, ...rest }: PageV24): PageV25 {
  return {
    animations: (animations || []).reduce(updateAnimation, []),
    ...rest,
  };
}

function updateAnimation(animations: AnimationV0[], animation: AnimationV0) {
  const { targets, id, ...rest } = animation;
  targets.forEach((target, i) => {
    animations.push({
      id: i === 0 ? id : uuidv4(),
      targets: [target],
      ...rest,
    });
  });
  return animations;
}

export default singleAnimationTarget;
