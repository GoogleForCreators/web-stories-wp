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
 * Add the given id to the current selection.
 *
 * If no id is given or id is already in the current selection, nothing happens.
 *
 * @param {Object} state Current state
 * @param {Object} payload Action payload
 * @param {string} payload.elementId Element id to add to the current selection.
 * @return {Object} New state
 */
function selectElement(state, { elementId }) {
  if (!elementId || state.selection.includes(elementId)) {
    return state;
  }

  const currentPage = state.pages.find(({ id }) => id === state.current);
  const isBackgroundElement = currentPage.elements[0].id === elementId;
  const hasExistingSelection = state.selection.length > 0;
  // The bg element can't be added to non-empty selection
  if (isBackgroundElement && hasExistingSelection) {
    return state;
  }

  // If bg element was already the (only) selection, set selection to new element only
  if (state.selection.includes(currentPage.elements[0].id)) {
    return {
      ...state,
      selection: [elementId],
    };
  }

  return {
    ...state,
    selection: [...state.selection, elementId],
  };
}

export default selectElement;
