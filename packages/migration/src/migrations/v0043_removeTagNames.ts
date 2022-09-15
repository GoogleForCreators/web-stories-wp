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
import type { Story, Element, Page } from '@googleforcreators/types';

export interface ElementV43 extends Element {
  tagName?: 'string';
}

export interface PageV43 extends Omit<Page, 'elements'> {
  elements: ElementV43[];
}

export interface StoryV43 extends Omit<Story, 'pages'> {
  pages: PageV43[];
}

function removeTagNames({ pages, ...rest }: StoryV43): Story {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV43): Page {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element: ElementV43): Element {
  delete element.tagName;
  return element as Element;
}

export default removeTagNames;
