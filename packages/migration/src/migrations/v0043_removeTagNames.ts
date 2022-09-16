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
 * External dependencies
 */
import type {
  Story,
  Page,
  TagName,
  TextElement,
  GifElement,
  ImageElement,
  ProductElement,
  ShapeElement,
  VideoElement,
} from '@googleforcreators/types';

/**
 * Internal dependencies
 */
import type { StoryElement } from '../types';

export interface TextElementV42 extends TextElement {
  tagName?: TagName;
}

export type ElementV42 =
  | GifElement
  | ImageElement
  | ProductElement
  | ShapeElement
  | TextElementV42
  | VideoElement;

export interface PageV42 extends Omit<Page, 'elements'> {
  elements: ElementV42[];
}

export interface StoryV42 extends Omit<Story, 'pages'> {
  pages: PageV42[];
}

function removeTagNames({ pages, ...rest }: StoryV42): Story {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV42): Page {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element: ElementV42): StoryElement {
  if ('tagName' in element) {
    delete element.tagName;
  }
  return element as StoryElement;
}

export default removeTagNames;
