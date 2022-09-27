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
import type {
  GifElementV17,
  ImageElementV17,
  PageV17,
  ProductElementV17,
  ShapeElementV17,
  StoryV17,
  TextElementV17,
  VideoElementV17,
} from './v0017_inlineTextProperties';

export interface ShapeElementV18 extends ShapeElementV17 {
  isDefaultBackground?: boolean;
}

export type TextElementV18 = TextElementV17;
export type ProductElementV18 = ProductElementV17;
export type ImageElementV18 = ImageElementV17;
export type VideoElementV18 = VideoElementV17;
export type GifElementV18 = GifElementV17;

export type UnionElementV18 =
  | ShapeElementV18
  | ImageElementV18
  | VideoElementV18
  | GifElementV18
  | TextElementV18
  | ProductElementV18;

export interface StoryV18 extends Omit<StoryV17, 'pages'> {
  pages: PageV18[];
}
export interface PageV18
  extends Omit<PageV17, 'elements' | 'backgroundElementId'> {
  elements: UnionElementV18[];
}

function createDefaultBackgroundElement({
  pages,
  ...rest
}: StoryV17): StoryV18 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({
  elements,
  backgroundElementId,
  ...rest
}: PageV17): PageV18 {
  const backgroundElement = elements[0];
  let extra = {};
  const updatedElements = { ...elements };
  if (backgroundElement.type === 'shape') {
    (updatedElements[0] as ShapeElementV18).isDefaultBackground = true;
  } else {
    extra = {
      defaultBackgroundElement: {
        type: 'shape',
        x: 1,
        y: 1,
        width: 1,
        height: 1,
        rotationAngle: 0,
        mask: {
          type: 'rectangle',
        },
        backgroundColor: {
          color: { r: 255, g: 255, b: 255, a: 1 },
        },
        isBackground: true,
        isDefaultBackground: true,
        id: uuidv4(),
      },
    };
  }
  // Note that we're not including `backgroundElementId` here
  return {
    elements: updatedElements,
    ...rest,
    ...extra,
  };
}

export default createDefaultBackgroundElement;
