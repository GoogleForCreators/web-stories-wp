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
import { elementIs, type Element } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import type {
  SetBackgroundElementProps,
  ReducerState,
  ReducerStateDraft,
} from '../../../../types';
import { moveArrayElement, removeAnimationsWithElementIds } from './utils';

/**
 * Set background element on the current page to element matching the given id.
 *
 * If element id is null, default background element is restored.
 *
 * If page had a background element before, that element is removed!
 * If that element was the default background element, it will be remembered as such.
 * If the removed background element was in selection, selection is cleared.
 *
 * Default background element can never be "set to nothing" - only replaced by another
 * element.
 */
export const setBackgroundElement = (
  draft: ReducerStateDraft,
  { elementId }: SetBackgroundElementProps
) => {
  const page = draft.pages.find(({ id }) => id === draft.current);
  if (!page) {
    return;
  }
  const currentBackgroundElement = page.elements[0];

  // If new id is null, clear background attribute and proceed
  if (elementId === null) {
    if (
      elementIs.defaultBackground(currentBackgroundElement) &&
      currentBackgroundElement.isDefaultBackground
    ) {
      // Nothing to do here, we can't unset default background
      return;
    }

    // Unset isBackground for the element, too.
    page.elements.filter(elementIs.backgroundable).forEach((element) => {
      delete element.isBackground;
    });
    if (page.defaultBackgroundElement) {
      page.elements.unshift(page.defaultBackgroundElement);
      draft.selection = [page.defaultBackgroundElement.id];
    }
  } else {
    // Does the element even exist or is it already background
    const elementPosition = page.elements.findIndex(
      ({ id }) => id === elementId
    );
    const isBackground = elementPosition === 0;
    const exists = elementPosition !== -1;
    if (!exists || isBackground) {
      return;
    }

    // If current bg is default, save it as such
    const wasDefault =
      elementIs.defaultBackground(currentBackgroundElement) &&
      currentBackgroundElement.isDefaultBackground;
    if (wasDefault) {
      page.defaultBackgroundElement = currentBackgroundElement;
    }

    // Slice first element out and update position
    page.elements.splice(0, 1);
    const currentPosition = elementPosition - 1;

    // Also remove old element from selection
    if (draft.selection.includes(currentBackgroundElement.id)) {
      draft.selection = draft.selection.filter(
        (id) => id !== currentBackgroundElement.id
      );
    }

    // Reorder elements and set element opacity to 100% because backgrounds
    // cannot be transparent.
    page.elements = moveArrayElement(
      page.elements,
      currentPosition,
      0
    ) as unknown as Element[];
    page.elements.forEach((element) => {
      // Set isBackground for the element.
      if (element.id === elementId && elementIs.backgroundable(element)) {
        element.isBackground = true;
        if (Object.prototype.hasOwnProperty.call(element, 'opacity')) {
          element.opacity = 100;
        }

        // See https://github.com/GoogleForCreators/web-stories-wp/issues/12778.
        element.isHidden = false;
      }
    });

    //  remove new element from selection if there's more than one element there
    if (draft.selection.includes(elementId) && draft.selection.length > 1) {
      draft.selection = draft.selection.filter((id) => id !== elementId);
    }
  }

  // Remove any applied background animations
  // or exising element animations.
  const backgroundElement = page.elements.find(
    (element) => elementIs.backgroundable(element) && element.isBackground
  );
  if (backgroundElement) {
    page.animations = removeAnimationsWithElementIds(page.animations, [
      elementId as string,
      backgroundElement.id,
    ]);
  }
};

export default produce<ReducerState, [SetBackgroundElementProps]>(
  setBackgroundElement
);
