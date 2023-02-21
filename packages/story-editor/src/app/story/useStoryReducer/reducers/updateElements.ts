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
import {
  StoryAnimationState,
  type StoryAnimation,
} from '@googleforcreators/animation';
import { produce } from 'immer';

/**
 * Internal dependencies
 */
import type {
  UpdateElementsProps,
  ReducerState,
  ReducerStateDraft,
} from '../../../../types';
import { updateElementWithUpdater, updateAnimations } from './utils';

/**
 * Update elements by the given list of ids with the given properties.
 * If given list of ids is `null`, update all currently selected elements.
 *
 * Elements will be updated only on the current page.
 *
 * If an element id does not correspond do an element on the current page, id is ignored.
 *
 * If an empty list or a list of only unknown ids is given, state is unchanged.
 *
 * If given set of properties is empty, state is unchanged.
 *
 * Current selection and page is unchanged.
 */
export const updateElements = (
  draft: ReducerStateDraft,
  { elementIds, properties: propertiesOrUpdater }: UpdateElementsProps
) => {
  if (
    [
      StoryAnimationState.Playing,
      StoryAnimationState.PlayingSelected,
      StoryAnimationState.Scrubbing,
    ].includes(draft.animationState)
  ) {
    return;
  }

  const idsToUpdate = elementIds === null ? draft.selection : elementIds;
  const page = draft.pages.find(({ id }) => id === draft.current);
  if (!page || !idsToUpdate) {
    return;
  }
  const animationLookup: Record<string, StoryAnimation> = {};
  page.elements
    .filter(({ id }) => idsToUpdate.includes(id))
    .forEach((element) => {
      // Update function will update the element inline unless there's an animation update.
      // If so, the element will remain unchanged, and the animation will be returned instead.
      const animation = updateElementWithUpdater(element, propertiesOrUpdater);
      if (animation) {
        animationLookup[animation.id] = {
          ...animation,
          targets: [element.id],
        };
      }
    });

  const isAnimationUpdate = Object.keys(animationLookup).length > 0;

  if (isAnimationUpdate) {
    page.animations = updateAnimations(page.animations || [], animationLookup);
  }
};

export default produce<ReducerState, [UpdateElementsProps]>(updateElements);
