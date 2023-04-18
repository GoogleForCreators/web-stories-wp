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
import type {
  PageV47,
  StoryV47,
  UnionElementV47,
} from './v0047_fixBrokenTemplates';

export interface PageV48 extends Omit<PageV47, 'elements'> {
  elements: Omit<UnionElementV47, 'basedOn'>[];
}

export interface StoryV48 extends Omit<StoryV47, 'pages'> {
  pages: PageV48[];
}

function removeBasedOnFromElements({ pages, ...rest }: StoryV47): StoryV48 {
  return {
    pages: pages.map(fixBrokenPage),
    ...rest,
  };
}

function fixBrokenPage({ elements, ...rest }: PageV47): PageV48 {
  return {
    elements: elements.map(
      (element) =>
        objectWithout(element, ['basedOn']) as Omit<UnionElementV47, 'basedOn'>
    ),
    ...rest,
  };
}

function objectWithout<T extends object>(
  obj: T,
  propertiesToRemove: string[]
): Partial<T> {
  return Object.keys(obj)
    .filter((key) => !propertiesToRemove.includes(key))
    .reduce((newObj, key) => ({ ...newObj, [key]: obj[key as keyof T] }), {});
}

export default removeBasedOnFromElements;
