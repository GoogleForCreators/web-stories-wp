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
 * Add the given id to the current selection.
 *
 * If no id is given or id is already in the current selection, nothing happens.
 *
 * @param {Object} state Current state
 * @param {Object} payload Action payload
 * @param {string} payload.elementId Element id to add to the current selection.
 * @return {Object} New state
 */
const selectElement = produce((draft, { elementId }) => {
  if (!elementId || draft.selection.includes(elementId)) {
    return;
  }

  const currentPage = draft.pages.find(({ id }) => id === draft.current);
  const byId = (i) => currentPage.elements.find(({ id }) => id === i);
  const isBackgroundElement = currentPage.elements[0].id === elementId;
  const element = byId(elementId);
  const isVideoPlaceholder = element?.resource?.isPlaceholder;
  const hasExistingSelection = draft.selection.length > 0;

  // The bg element can't be added to non-empty selection.
  // Same goes for video elements with placeholder resources.
  if ((isBackgroundElement || isVideoPlaceholder) && hasExistingSelection) {
    return;
  }

  // If background element or locked element was already the (only) selection,
  // or the new element is locked, set selection to new element only
  const isLockedElement = element?.isLocked;
  const wasBackground = draft.selection.includes(currentPage.elements[0].id);
  const wasLockedElement = draft.selection.some((id) => byId(id).isLocked);
  if (wasBackground || isLockedElement || wasLockedElement) {
    draft.selection = [elementId];
  } else {
    draft.selection.push(elementId);
  }
});

export default selectElement;
