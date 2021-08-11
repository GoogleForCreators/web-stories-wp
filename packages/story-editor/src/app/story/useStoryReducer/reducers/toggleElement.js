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
 * Toggle element id in selection.
 *
 * If the given id is currently selected, remove it from selection.
 *
 * Otherwise add the given id to the current selection.
 *
 * If no id is given, do nothing.
 *
 * @param {Object} state Current state
 * @param {Object} payload Action payload
 * @param {string} payload.elementId Id to either add or remove from selection.
 * @return {Object} New state
 */
function toggleElement(state, { elementId }) {
  if (!elementId) {
    return state;
  }

  const wasSelected = state.selection.includes(elementId);
  const currentPage = state.pages.find(({ id }) => id === state.current);
  const backgroundElementId = currentPage.elements[0].id;
  const isBackgroundElement = backgroundElementId === elementId;
  const hasExistingSelection = state.selection.length > 0;

  // If it wasn't selected, we're adding the element to the selection.
  if (!wasSelected) {
    // The bg element can't be added to non-empty selection
    if (isBackgroundElement && hasExistingSelection) {
      return state;
    }

    // If bg element was already the (only) selection, set selection to new element only
    if (state.selection.includes(backgroundElementId)) {
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

  // Otherwise just filter out from current selection
  return {
    ...state,
    selection: state.selection.filter((id) => id !== elementId),
  };
}

export default toggleElement;
