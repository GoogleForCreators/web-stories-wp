/*
 * Copyright 2022 Google LLC
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
import type { ElementV42, PageV42, StoryV42 } from './v0042_removeTrackName';
import {
  GifElement,
  ImageElement,
  ProductElement,
  ShapeElement,
  TextElement,
  VideoElement
} from "@googleforcreators/types";


type GenElement =
  | GifElement
  | ImageElement
  | ProductElement
  | ShapeElement
  | TextElement
  | VideoElement;

export interface ElementV41 extends ElementV42 {}

function removeFontProperties({ pages, ...rest }: StoryV42) {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV42) {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element: GenElement) {
  if ('font' in element) {
    const { id, name, value, ...newFontFormatted } = element.font;
    element.font = newFontFormatted;
  }
  return element;
}

export default removeFontProperties;
