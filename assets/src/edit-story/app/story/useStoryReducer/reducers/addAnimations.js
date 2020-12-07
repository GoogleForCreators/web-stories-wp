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
import { exclusion } from './utils';

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
 *
 * @param {Object} state Current state
 * @param {Object} payload Action payload
 * @param {Array.<Object>} payload.animations Elements to insert on the given page.
 * @return {Object} New state
 */
function addAnimations(state, { animations }) {
  if (!Array.isArray(animations)) {
    return state;
  }

  const pageIndex = state.pages.findIndex(({ id }) => id === state.current);
  const oldPage = state.pages[pageIndex];
  const oldPageAnimations = oldPage.animations || [];
  const newAnimations = exclusion(oldPageAnimations, animations);

  if (newAnimations.length === 0) {
    return state;
  }

  const newPage = {
    ...oldPage,
    animations: [...oldPageAnimations, ...newAnimations],
  };

  const newPages = [
    ...state.pages.slice(0, pageIndex),
    newPage,
    ...state.pages.slice(pageIndex + 1),
  ];

  return {
    ...state,
    pages: newPages,
  };
}

export default addAnimations;
