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
import type { Pattern, PatternType } from '../types/pattern';
import type {
  GifElementV22,
  ImageElementV22,
  PageV22,
  ProductElementV22,
  ShapeElementV22,
  StoryV22,
  TextElementV22,
  VideoElementV22,
} from './v0022_dataPixelTo412';

export type TextElementV23 = TextElementV22;
export type ProductElementV23 = ProductElementV22;
export interface ShapeElementV23 extends ShapeElementV22 {
  backgroundOverlay?: Pattern | null;
}
export interface ImageElementV23 extends ImageElementV22 {
  backgroundOverlay?: Pattern | null;
}
export interface VideoElementV23 extends VideoElementV22 {
  backgroundOverlay?: Pattern | null;
}
export interface GifElementV23 extends GifElementV22 {
  backgroundOverlay?: Pattern | null;
}

export type UnionElementV23 =
  | ShapeElementV23
  | ImageElementV23
  | VideoElementV23
  | GifElementV23
  | TextElementV23
  | ProductElementV23;

export interface StoryV23 extends Omit<StoryV22, 'pages'> {
  pages: PageV23[];
}
export interface PageV23 extends Omit<
  PageV22,
  'elements' | 'backgroundOverlay'
> {
  elements: UnionElementV23[];
}

function convertOverlayPattern({ pages, ...rest }: StoryV22): StoryV23 {
  return {
    pages: pages.map(convertPage),
    ...rest,
  };
}

function convertPage({
  elements,
  backgroundOverlay,
  ...rest
}: PageV22): PageV23 {
  const hasNonTrivialOverlay =
    backgroundOverlay &&
    ['solid', 'linear', 'radial'].includes(backgroundOverlay);
  const backgroundElement = elements[0];
  const isValidBackgroundElement = ['image', 'video'].includes(
    backgroundElement?.type
  );
  if (!hasNonTrivialOverlay || !isValidBackgroundElement) {
    return {
      elements,
      ...rest,
    };
  }

  return {
    elements: [
      {
        ...backgroundElement,
        backgroundOverlay: getBackgroundOverlay(backgroundOverlay),
      },
      ...elements.slice(1),
    ],
    ...rest,
  };
}

function getBackgroundOverlay(overlayType: string): Pattern | null {
  switch (overlayType) {
    case 'solid':
      return {
        color: { r: 0, g: 0, b: 0, a: 0.3 },
      };

    case 'linear':
      return {
        type: 'linear' as PatternType.Linear,
        rotation: 0,
        stops: [
          { color: { r: 0, g: 0, b: 0, a: 0 }, position: 0.4 },
          { color: { r: 0, g: 0, b: 0, a: 1 }, position: 1 },
        ],
        alpha: 0.9,
      };

    case 'radial':
      return {
        type: 'radial' as PatternType.Radial,
        size: { w: 0.8, h: 0.5 },
        stops: [
          { color: { r: 0, g: 0, b: 0, a: 0 }, position: 0.25 },
          { color: { r: 0, g: 0, b: 0, a: 1 }, position: 1 },
        ],
        alpha: 0.6,
      };

    default:
      return null;
  }
}

export default convertOverlayPattern;
