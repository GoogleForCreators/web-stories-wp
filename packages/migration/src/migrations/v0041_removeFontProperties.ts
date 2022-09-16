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
  FontStyle,
  FontVariant,
  FontWeight,
} from '@googleforcreators/types';

/**
 * Internal dependencies
 */
import type { PageV41, StoryV41 } from './v0042_removeTrackName';
import type { ElementV42 } from './v0043_removeTagNames';

interface FontV40 {
  id?: string;
  name?: string;
  value?: string;
  family: string;
  service?: string;
  weights?: FontWeight[];
  styles?: FontStyle[];
  variants?: FontVariant[];
  fallbacks?: string[];
}

// We extend V42 here instead of V41 since it's the same as V42.
export type ElementV40 = Omit<ElementV42, 'font'> & {
  font: FontV40;
};

export interface PageV40 extends Omit<PageV41, 'elements'> {
  elements: ElementV40[];
}

export interface StoryV40 extends Omit<StoryV41, 'pages'> {
  pages: PageV40[];
}

function removeFontProperties({ pages, ...rest }: StoryV40): StoryV41 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV40): PageV41 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element: ElementV40): ElementV42 {
  if ('font' in element) {
    const { id, name, value, ...newFontFormatted } = element.font;
    element.font = newFontFormatted;
  }
  return element as ElementV42;
}

export default removeFontProperties;
