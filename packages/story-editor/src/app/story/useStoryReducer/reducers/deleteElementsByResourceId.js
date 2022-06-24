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
 * Delete elements by the given resource id.
 *
 * Contrary to deleteElements this works across all pages, not just the current one.
 *
 * If an empty id or a no matches with id, state is unchanged.
 *
 * If no element with the given resource id is found, state is changed.
 *
 * @param {Object} state Current state
 * @param {Object} payload Action payload
 * @param {string|null} payload.id id Delete all elements with this resource id
 * @return {Object} New state
 */
function deleteElementsByResourceId(state, { id }) {
  if (id === null) {
    return state;
  }

  const hasElementWithResourceId = state.pages.some((page) =>
    page.elements.some((element) => element.resource?.id === id)
  );

  if (!hasElementWithResourceId) {
    return state;
  }

  const idsToDelete = [];

  const newPages = state.pages.map((page) => {
    const { elements, animations } = page;

    const isDeletingBackground = elements[0].resource?.id === id;

    let newElements = elements.map((element) => {
      const { id: elementId, resource } = element;
      if (resource?.id !== id) {
        return element;
      }

      idsToDelete.push(elementId);

      return undefined;
    });

    if (isDeletingBackground) {
      newElements = [page.defaultBackgroundElement, ...newElements];
    }

    newElements = newElements.filter(Boolean);

    // Remove animations associated with elements
    const oldAnimations = animations || [];
    const newAnimations = oldAnimations.filter((anim) =>
      anim.targets.some((elementId) => !idsToDelete.includes(elementId))
    );

    return {
      ...page,
      elements: newElements,
      ...(oldAnimations.length > 0 ? { animations: newAnimations } : {}),
    };
  });

  const newSelection = state.selection.filter(
    (selectedId) => !idsToDelete.includes(selectedId)
  );

  return {
    ...state,
    pages: newPages,
    selection: newSelection,
  };
}

export default deleteElementsByResourceId;
