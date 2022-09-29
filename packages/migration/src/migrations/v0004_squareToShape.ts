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
  StoryV4,
  PageV4,
  UnionElementV4, ShapeElementV4,
} from './v0004_mediaElementToResource';

function dataSquareToShape({ pages, ...rest }: StoryV4): StoryV4 {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }: PageV4): PageV4 {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element: UnionElementV4): UnionElementV4 {
  const { type, ...rest } = element;
  if ('backgroundColor' in element && 'square' === type) {
    return {
      type: 'shape',
      ...rest,
    } as ShapeElementV4;
  }
  return element;
}

export default dataSquareToShape;
