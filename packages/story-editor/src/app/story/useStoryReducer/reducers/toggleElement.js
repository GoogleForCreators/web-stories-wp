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
 * If old selection was a single element, that is locked, and/or if new
 * element is locked, create new selection of only the new element.
 *
 * If no id is given, do nothing.
 *
 * @param {Object} state Current state
 * @param {Object} payload Action payload
 * @param {string} payload.elementId Id to either add or remove from selection.
 * @param {boolean} payload.withLinked Include elements from the group?
 * @return {Object} New state
 */
function toggleElement(state, { elementId, withLinked = false }) {
  if (!elementId) {
    return state;
  }

  const wasSelected = state.selection.includes(elementId);
  const currentPage = state.pages.find(({ id }) => id === state.current);
  const backgroundElementId = currentPage.elements[0].id;
  const isBackgroundElement = backgroundElementId === elementId;
  const hasExistingSelection = state.selection.length > 0;

  const elementGroupId = currentPage.elements.find(
    ({ id }) => id === elementId
  )?.groupId;
  let allIds = [elementId];

  if (elementGroupId && withLinked) {
    const elementsFromGroups = currentPage.elements.filter(
      ({ groupId }) => elementGroupId === groupId
    );
    const elementsIdsFromGroups = elementsFromGroups.map(({ id }) => id);
    const selectionWithGroups = state.selection.concat(elementsIdsFromGroups);
    allIds = allIds.concat(selectionWithGroups);
  }

  // If it wasn't selected, we're adding the element to the selection.
  if (!wasSelected) {
    // The bg element can't be added to non-empty selection
    if (isBackgroundElement && hasExistingSelection) {
      return state;
    }

    // The resulting selection will be only the new element under three circumstances:
    // * if old selection was just the background element
    // * if old selection was just a locked element
    // * if new selection is a locked element
    const selectionWasOnlyBackground =
      state.selection.includes(backgroundElementId);
    const getElementById = (byId) =>
      currentPage.elements.find(({ id }) => id === byId);
    const oldElement = getElementById(state.selection[0]);
    const newElement = getElementById(elementId);
    const resultIsOnlyNewElement =
      selectionWasOnlyBackground || oldElement.isLocked || newElement.isLocked;

    // If either of those, return a new selection of only the new element
    if (resultIsOnlyNewElement) {
      return {
        ...state,
        selection: allIds,
      };
    }

    return {
      ...state,
      selection: [...state.selection, ...allIds],
    };
  }

  // Otherwise just filter out from current selection
  return {
    ...state,
    selection: state.selection.filter((id) => !allIds.includes(id)),
  };
}

export default toggleElement;
