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
const deleteElementsByResourceId = produce((draft, { id }) => {
  if (id === null) {
    return;
  }

  const hasElementWithResourceId = draft.pages.some((page) =>
    page.elements.some((element) => element.resource?.id === id)
  );

  if (!hasElementWithResourceId) {
    return;
  }

  const idsToDelete = [];

  draft.pages.forEach((page) => {
    const { elements, animations } = page;

    const isDeletingBackground = elements[0].resource?.id === id;

    page.elements = elements.filter((element) => {
      const { id: elementId, resource } = element;
      if (resource?.id === id) {
        idsToDelete.push(elementId);
        return false;
      }
      return true;
    });

    if (isDeletingBackground) {
      page.elements.unshift(page.defaultBackgroundElement);
    }

    // Remove animations associated with elements
    if (animations) {
      page.animations = animations.filter((anim) =>
        anim.targets.some((elementId) => !idsToDelete.includes(elementId))
      );
    }
  });

  draft.selection = draft.selection.filter(
    (selectedId) => !idsToDelete.includes(selectedId)
  );
});

export default deleteElementsByResourceId;
