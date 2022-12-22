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
import { elementIs } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import type {
  DeleteElementsByResourceIdProps,
  ReducerState,
  ReducerStateDraft,
} from '../../../../types';

/**
 * Delete elements by the given resource id.
 *
 * Contrary to deleteElements this works across all pages, not just the current one.
 *
 * If an empty id or a no matches with id, state is unchanged.
 *
 * If no element with the given resource id is found, state is changed.
 */
export const deleteElementsByResourceId = (
  draft: ReducerStateDraft,
  { id }: DeleteElementsByResourceIdProps
) => {
  if (id === null) {
    return;
  }

  const hasElementWithResourceId = draft.pages.some((page) =>
    page.elements
      .filter(elementIs.media)
      .some((element) => element.resource.id === id)
  );

  if (!hasElementWithResourceId) {
    return;
  }

  const deletedElementIds: string[] = [];

  draft.pages.forEach((page) => {
    const { elements, animations } = page;

    const isDeletingBackground =
      elementIs.media(elements[0]) && elements[0].resource?.id === id;

    page.elements = elements.filter(elementIs.media).filter((element) => {
      if (element.resource.id === id) {
        deletedElementIds.push(element.id);
        return false;
      }
      return true;
    });

    if (isDeletingBackground && page.defaultBackgroundElement) {
      page.elements.unshift(page.defaultBackgroundElement);
    }

    // Remove animations associated with elements
    if (animations) {
      page.animations = animations.filter((anim) =>
        anim.targets.some((elementId) => !deletedElementIds.includes(elementId))
      );
    }
  });

  draft.selection = draft.selection.filter(
    (selectedId) => !deletedElementIds.includes(selectedId)
  );
};

export default produce<ReducerState, [DeleteElementsByResourceIdProps]>(
  deleteElementsByResourceId
);
