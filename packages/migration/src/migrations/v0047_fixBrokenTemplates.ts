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
import type { ElementId } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import type { AnimationV0 } from '../types';
import type {
  PageV46,
  StoryV46,
  UnionElementV46,
} from './v0046_removeRedundantScalingProperties';

export type StoryV47 = StoryV46;
export type PageV47 = PageV46;
export type UnionElementV47 = UnionElementV46;

function fixBrokenTemplate({ pages, ...rest }: StoryV46): StoryV47 {
  return {
    pages: pages.map(fixBrokenPage),
    ...rest,
  };
}

function fixBrokenPage({ elements, animations, ...rest }: PageV46): PageV47 {
  const elementIds = elements.map(({ id }) => id);

  return {
    elements: fixElementOrder(elements),
    ...(animations
      ? {
          animations: (animations as AnimationV0[]).filter((animation) =>
            removeBrokenAnimation(animation, elementIds)
          ),
        }
      : {}),
    ...rest,
  };
}

function fixElementOrder(elements: UnionElementV46[]) {
  const newElements: UnionElementV47[] = [];
  while (elements.length) {
    const nextElement = elements.shift() as UnionElementV46;
    newElements.push(nextElement);
    if (!nextElement.groupId) {
      continue;
    }
    // Find all group members in order and move them one by one
    const { groupId } = nextElement;
    const isGroupMember = (e: UnionElementV46) => e.groupId === groupId;
    while (elements.some(isGroupMember)) {
      const index = elements.findIndex(isGroupMember);
      newElements.push(...elements.splice(index, 1));
    }
  }
  return newElements;
}

function removeBrokenAnimation(
  animation: AnimationV0,
  elementIds: ElementId[]
): boolean {
  return elementIds.includes(animation.targets[0]);
}

export default fixBrokenTemplate;
