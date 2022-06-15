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
import { intersect } from './utils';

/**
 * Delete elements by the given list of ids.
 * If given list of ids is `null`, delete all currently selected elements.
 *
 * Elements will be deleted on the current page only.
 *
 * If an element id does not correspond do an element on the current page, id is ignored.
 *
 * If an empty list or a list of only unknown ids is given, state is unchanged.
 *
 * If any id to delete is the current background element, background element will be unset for the page,
 * and default background element will be restored. Default background element cannot be removed.
 *
 * If any id to delete is in current selection, deleted ids are removed from selection.
 * Otherwise selection is unchanged.
 *
 * Current page is unchanged.
 *
 * @param {Object} state Current state
 * @param {Object} payload Action payload
 * @param {Array.<string>} payload.elementIds List of ids of elements to delete.
 * @return {Object} New state
 */
const deleteElements = produce((draft, { elementIds }) => {
  const idsToDelete = elementIds === null ? draft.selection : elementIds;

  if (idsToDelete.length === 0) {
    return;
  }

  const page = draft.pages.find(({ id }) => id === draft.current);
  const pageElementIds = page.elements.map(({ id }) => id);
  const backgroundElement = page.elements[0];

  const isDeletingBackground = idsToDelete.some(
    (id) => id === backgroundElement.id
  );
  const backgroundIsDefault = backgroundElement.isDefaultBackground;

  const validDeletionIds =
    isDeletingBackground && backgroundIsDefault
      ? idsToDelete.filter((id) => id !== backgroundElement.id)
      : idsToDelete;

  // Nothing to delete?
  const hasAnythingToDelete =
    intersect(pageElementIds, validDeletionIds).length > 0;
  if (!hasAnythingToDelete) {
    return;
  }

  page.elements = page.elements.filter(
    (element) => !validDeletionIds.includes(element.id)
  );

  // Restore default background if non-default bg has been deleted.
  if (isDeletingBackground && !backgroundIsDefault) {
    page.elements.unshift(page.defaultBackgroundElement);
  }

  // Remove animations associated with elements
  if (page.animations) {
    page.animations = page.animations.filter((anim) =>
      anim.targets.some((elementId) => !validDeletionIds.includes(elementId))
    );
  }

  draft.selection = draft.selection.filter(
    (id) => !validDeletionIds.includes(id)
  );
});

export default deleteElements;
