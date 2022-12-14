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
import { StoryAnimationState } from '@googleforcreators/animation';
import { elementIs } from '@googleforcreators/elements';
import { produce, current } from 'immer';

/**
 * Internal dependencies
 */
import type {
  SetSelectedElementsProps,
  ReducerState,
  ReducerStateDraft,
} from '../../../../types';
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
 */
export const setSelectedElements = (
  draft: ReducerStateDraft,
  { elementIds, withLinked = false }: SetSelectedElementsProps
) => {
  const newElementIds =
    typeof elementIds === 'function'
      ? elementIds(current(draft.selection))
      : elementIds;

  if (!Array.isArray(newElementIds)) {
    return;
  }

  const currentPage = draft.pages.find(({ id }) => id === draft.current);
  if (!currentPage) {
    return;
  }
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
  if (draft.selection.length === uniqueElementIds.length) {
    // If intersection of the two lists has the same length as the old list,
    // nothing will change.
    // NB: this assumes selection is always without duplicates.
    const commonElements = intersect(draft.selection, uniqueElementIds);
    if (commonElements.length === draft.selection.length) {
      return;
    }
  }

  // If it's a non-group multi-selection, filter out the background element,
  // locked elements, and video placeholders.
  const byId = (id: string) =>
    currentPage.elements.find(({ id: i }) => i === id);
  const isMultiSelection = uniqueElementIds.length > 1;
  const isGroupSelection = withLinked;
  const isNotBackgroundElement = (id: string) =>
    currentPage.elements[0].id !== id;
  const isLockedElement = (id: string) => byId(id)?.isLocked;
  const isVideoPlaceholder = (id: string) => {
    const e = byId(id);
    return e && elementIs.media(e) && e.resource?.isPlaceholder;
  };
  const newSelection =
    isMultiSelection && !isGroupSelection
      ? uniqueElementIds.filter(
          (id) =>
            isNotBackgroundElement(id) &&
            !isVideoPlaceholder(id) &&
            !isLockedElement(id)
        )
      : uniqueElementIds;

  draft.animationState = StoryAnimationState.Reset;
  draft.selection = newSelection;
};

export default produce<ReducerState, [SetSelectedElementsProps]>(
  setSelectedElements
);
