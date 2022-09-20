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
import type { PageV0, UnionElementV0 } from '../types';
import type { StoryV1 } from './v0001_storyDataArrayToObject';

const NEW_PAGE_WIDTH = 1080;
const NEW_PAGE_HEIGHT = 1920;
const OLD_PAGE_WIDTH = 412;
const OLD_PAGE_HEIGHT = 732;

const SCALE_X = NEW_PAGE_WIDTH / OLD_PAGE_WIDTH;
const SCALE_Y = NEW_PAGE_HEIGHT / OLD_PAGE_HEIGHT;

export type StoryV2 = StoryV1;
export type PageV2 = PageV0;
export type UnionElementV2 = UnionElementV0;

function dataPixelTo1080({ pages, ...rest }: StoryV1): StoryV2 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV0): PageV0 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement({
  x,
  y,
  width,
  height,
  ...rest
}: UnionElementV0): UnionElementV0 {
  const element = {
    x: dataPixels(x * SCALE_X),
    y: dataPixels(y * SCALE_Y),
    width: dataPixels(width * SCALE_X),
    height: dataPixels(height * SCALE_Y),
    ...rest,
  };
  if ('fontSize' in element && typeof element.fontSize === 'number') {
    element.fontSize = dataPixels(element.fontSize * SCALE_Y);
  }
  return element;
}

/**
 * See `units/dimensions.js`.
 *
 * @param v The value to be rounded.
 * @return The value rounded to the "data" space precision.
 */
function dataPixels(v: number) {
  return Number(v.toFixed(0));
}

export default dataPixelTo1080;
