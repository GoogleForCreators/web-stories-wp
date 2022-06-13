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
import { STORY_ANIMATION_STATE } from '@googleforcreators/animation';
/**
 * Internal dependencies
 */
import { intersect } from './utils';

/**
 * Set selected elements to the given list of ids.
 *
 * If given `elementIds` is not a list, do nothing.
 *
 * If given list matches (ignoring permutations) the current selection,
 * nothing happens.
 *
 * Duplicates will be removed from the given list of element ids.
 *
 * Locked elements can never be part of a multi-selection, so remove those if so.
 *
 * Current page and pages are unchanged.
 *
 * @param {Object} state Current state
 * @param {Object} payload Action payload
 * @param {Array.<string>} payload.elementIds Object with properties of new page
 * @param {boolean} payload.withLinked With linked.
 * @return {Object} New state
 */
function setSelectedElements(state, { elementIds, withLinked = false }) {
  const newElementIds =
    typeof elementIds === 'function' ? elementIds(state.selection) : elementIds;

  if (!Array.isArray(newElementIds)) {
    return state;
  }

  const currentPage = state.pages.find(({ id }) => id === state.current);
  let allIds = newElementIds;

  if (withLinked) {
    const elements = currentPage.elements.filter(({ id }) =>
      newElementIds.includes(id)
    );
    const groupIds = elements.map(({ groupId }) => groupId).filter(Boolean);
    const elementsFromGroups = currentPage.elements.filter(({ groupId }) =>
      groupIds.includes(groupId)
    );
    const elementsIdsFromGroups = elementsFromGroups.map(({ id }) => id);
    allIds = allIds.concat(elementsIdsFromGroups);
  }

  const uniqueElementIds = [...new Set(allIds)];

  // They can only be similar if they have the same length
  if (state.selection.length === uniqueElementIds.length) {
    // If intersection of the two lists has the same length as the old list,
    // nothing will change.
    // NB: this assumes selection is always without duplicates.
    const commonElements = intersect(state.selection, uniqueElementIds);
    if (commonElements.length === state.selection.length) {
      return state;
    }
  }

  // If it's a multi-selection, filter out the background element, locked elements,
  // and video placeholders.
  const byId = (id) => currentPage.elements.find(({ id: i }) => i === id);
  const isNotBackgroundElement = (id) => currentPage.elements[0].id !== id;
  const isNotLockedElement = (id) => !byId(id).isLocked;
  const isNotVideoPlaceholder = (id) => !byId(id).resource?.isPlaceholder;
  const newSelection =
    uniqueElementIds.length > 1
      ? uniqueElementIds.filter(
          (id) =>
            isNotBackgroundElement(id) &&
            isNotVideoPlaceholder(id) &&
            isNotLockedElement(id)
        )
      : uniqueElementIds;

  return {
    ...state,
    animationState: STORY_ANIMATION_STATE.RESET,
    selection: newSelection,
  };
}

export default setSelectedElements;
