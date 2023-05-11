/*
 * Copyright 2021 Google LLC
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
import {
  duplicateElement,
  ELEMENT_TYPES,
  elementIs,
} from '@googleforcreators/elements';
import { produce } from 'immer';

/**
 * Internal dependencies
 */
import type {
  DuplicateElementsByIdProps,
  ReducerState,
  ReducerStateDraft,
} from '../../../../types';

/**
 * Duplicate all elements specified by `elementIds` on the current page.
 * Set selected elements to be the newly created elements.
 *
 * If given `elementIds` are not a list, do nothing.
 */
export const duplicateElementsById = (
  draft: ReducerStateDraft,
  { elementIds }: DuplicateElementsByIdProps
) => {
  const page = draft.pages.find(({ id }) => id === draft.current);
  if (!page) {
    return;
  }
  let hasDeletedSomething = false;

  elementIds.forEach((elementId) => {
    const elementIndex = page.elements.findIndex(({ id }) => id === elementId);

    if (elementIndex < 0) {
      return;
    }

    const elementToDuplicate = page.elements[elementIndex];

    if (
      elementIs.backgroundable(elementToDuplicate) &&
      elementToDuplicate.isBackground
    ) {
      return;
    }

    if (elementToDuplicate.type === ELEMENT_TYPES.PRODUCT) {
      return;
    }
    const { element, elementAnimations } = duplicateElement({
      element: elementToDuplicate,
      animations: page.animations,
      currentElements: page?.elements,
    });

    if (!hasDeletedSomething) {
      hasDeletedSomething = true;
      draft.selection = [];
    }

    draft.selection.push(element.id);

    if (page.animations) {
      page.animations = page.animations.concat(elementAnimations);
    }
    page.elements.splice(elementIndex + 1, 0, element);
  });
};

export default produce<ReducerState, [DuplicateElementsByIdProps]>(
  duplicateElementsById
);
