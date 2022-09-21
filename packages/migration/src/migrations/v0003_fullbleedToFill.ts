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
  ElementV2,
  MediaElementV2,
  PageV2,
  StoryV2,
  VideoElementV2,
  GifElementV2,
  ImageElementV2,
  TextElementV2,
} from './v0002_dataPixelTo1080';

export interface MediaElementV3 extends Omit<MediaElementV2, 'isFullbleed'> {
  isFill?: boolean;
}

export interface VideoElementV3 extends Omit<VideoElementV2, 'isFullbleed'> {
  isFill?: boolean;
}

export interface GifElementV3 extends Omit<GifElementV2, 'isFullbleed'> {
  isFill?: boolean;
}

export interface ImageElementV3 extends Omit<ImageElementV2, 'isFullbleed'> {
  isFill?: boolean;
}

export type ElementV3 = ElementV2;
export type PageV3 = PageV2;
export type StoryV3 = StoryV2;
export type TextElementV3 = TextElementV2;

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

function isMediaElement(element: ElementV2): element is MediaElementV2 {
  return 'isFullbleed' in element;
}

function updateElement(element: ElementV2): ElementV3 {
  if (isMediaElement(element)) {
    const { isFullbleed, ...rest } = element;
    return {
      isFill: isFullbleed,
      ...rest,
      // @todo If we use `Element` instead of the union element type, we'll need to do quite a lot of casting like this, is that ok?
    } as ElementV3;
  }
  return element;
}

export default fullbleedToFill;
