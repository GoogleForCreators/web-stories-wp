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
import { produce } from 'immer';

/**
 * Internal dependencies
 */
import { exclusion } from './utils';
import type {AddAnimationsProps, State} from "../../../../types/storyProvider";

/**
 * Add animations to current page.
 *
 * Animations are expected to a be list of element objects with at least an id property.
 * If any animation id already exists on the page, animation is skipped (not even updated).
 * If multiple animations in the new list have the same id, only the latter is used.
 *
 * If animations aren't a list or an empty list (after duplicates have been filtered), nothing happens.
 *
 * Animations will be added to the end of the list of animations on the current page.
 */
export const addAnimations = (
  draft: State,
  { animations }: AddAnimationsProps
) => {
  if (!Array.isArray(animations)) {
    return;
  }

  const page = draft.pages.find(({ id }) => id === draft.current);

  if (!page.animations) {
    page.animations = [];
  }
  page.animations = page.animations.concat(
    exclusion(page.animations, animations)
  );
};

export default produce(addAnimations);
