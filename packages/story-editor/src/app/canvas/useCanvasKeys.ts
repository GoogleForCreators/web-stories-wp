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
import { useCallback, useEffect, useRef } from '@googleforcreators/react';
import { trackEvent } from '@googleforcreators/tracking';
import {
  useGlobalKeyDownEffect,
  getKeyboardMovement,
  useSnackbar,
} from '@googleforcreators/design-system';
import { StoryAnimationState } from '@googleforcreators/animation';
import { getDefinitionForType, elementIs } from '@googleforcreators/elements';
import { __, sprintf } from '@googleforcreators/i18n';
import type { RefObject } from 'react';

/**
 * Internal dependencies
 */
import { states } from '../highlights';
import useHighlights from '../highlights/useHighlights';
import { useStory } from '../story';
import getLayerArrangementProps from './utils/getLayerArrangementProps';
import { useCanvas } from '.';

function useCanvasKeys(ref: RefObject<Node>) {
  const {
    selectedElementIds,
    selectedElements,
    arrangeSelection,
    deleteSelectedElements,
    duplicateElementsById,
    updateSelectedElements,
    setSelectedElementsById,
    currentPage,
    currentPageNumber,
    animationState,
    updateAnimationState,
    currentPageProductIds,
    pageElements,
  } = useStory(
    ({
      state: {
        selectedElementIds,
        selectedElements,
        currentPage,
        currentPageNumber,
        animationState,
      },
      actions: {
        arrangeSelection,
        deleteSelectedElements,
        duplicateElementsById,
        updateSelectedElements,
        setSelectedElementsById,
        updateAnimationState,
      },
    }) => {
      return {
        currentPage,
        currentPageNumber,
        selectedElementIds,
        selectedElements,
        arrangeSelection,
        deleteSelectedElements,
        duplicateElementsById,
        updateSelectedElements,
        setSelectedElementsById,
        animationState,
        updateAnimationState,
        currentPageProductIds: currentPage?.elements
          ?.filter(elementIs.product)
          .map(({ product }) => product?.productId),
        pageElements: currentPage?.elements,
      };
    }
  );

  const showSnackbar = useSnackbar(({ showSnackbar }) => showSnackbar);

  const { setHighlights } = useHighlights(({ setHighlights }) => ({
    setHighlights,
  }));

  const { isEditing, getNodeForElement, setEditingElement } = useCanvas(
    ({
      state: { isEditing },
      actions: { getNodeForElement, setEditingElement },
    }) => ({
      isEditing,
      getNodeForElement,
      setEditingElement,
    })
  );
  const selectedElementIdsRef = useRef<string[] | null>(null);
  selectedElementIdsRef.current = selectedElementIds;

  // Return focus back to the canvas when another section loses the focus.
  useEffect(() => {
    const container = ref.current;
    if (!container) {
      return undefined;
    }

    const doc = container.ownerDocument;
    if (!doc) {
      return undefined;
    }

    const handler = () => {
      // Make sure that no other component is trying to get the focus
      // at this time. We have to check all "focusout" events here because
      // after DOM removal, the "focusout" events are all over the place.
      setTimeout(() => {
        if (doc.activeElement === doc.body) {
          // For a single selection, select the frame of this element.
          // If none or multiple selection, select the container.
          const currentSelectedIds = selectedElementIdsRef.current;
          const selectedFrame =
            currentSelectedIds?.length === 1
              ? getNodeForElement(currentSelectedIds[0])
              : null;

          // Check if the selection event happened outside the canvas area
          // If there is any text selection, we should not add the preventScroll setting,
          // so that the user can select the text properly.
          const sel = window.getSelection();
          if (sel?.toString() !== '') {
            return;
          }

          // If there is a multi-selection happening inside the canvas
          // container, we should prevent the first element from scrolling.
          if (selectedFrame) {
            (selectedFrame as HTMLElement).focus({ preventScroll: true });
          } else {
            (container as HTMLElement).focus({ preventScroll: true });
          }
        }
      }, 300);
    };
    doc.addEventListener('focusout', handler, true);
    return () => {
      doc.removeEventListener('focusout', handler, true);
    };
  }, [ref, getNodeForElement]);

  useGlobalKeyDownEffect('delete', () => deleteSelectedElements(), [
    deleteSelectedElements,
  ]);

  useGlobalKeyDownEffect(
    { key: ['mod+a'] },
    () => {
      if (!currentPage) {
        return;
      }
      const elementIds = currentPage.elements.map(({ id }) => id);
      setSelectedElementsById({ elementIds });
    },
    [currentPage, setSelectedElementsById]
  );

  // Position (x/y) key handler.
  useGlobalKeyDownEffect(
    { key: ['up', 'down', 'left', 'right'], shift: true },
    ({ key, shiftKey }) => {
      if (isEditing) {
        return;
      }
      const { isLocked } = selectedElements?.[0] || {};
      if (
        (elementIs.backgroundable(selectedElements?.[0]) &&
          selectedElements[0].isBackground) ||
        isLocked
      ) {
        return;
      }
      const { dx, dy } = getKeyboardMovement(key, shiftKey);
      updateSelectedElements({
        properties: ({ x, y }) => ({
          x: x + dx,
          y: y + dy,
        }),
      });
    },
    [updateSelectedElements, isEditing, selectedElements]
  );

  // Layer up/down.
  useGlobalKeyDownEffect(
    { key: ['mod+up', 'mod+down', 'mod+left', 'mod+right'], shift: true },
    (evt) => {
      const { key, shiftKey } = evt;

      // Cancel the default behavior of the event: it's very jarring to run
      // into mod+left/right triggering the browser's back/forward navigation.
      evt.preventDefault();

      // The shortcut doesn't support moving multiple elements currently.
      if (selectedElements?.length === 1 && pageElements) {
        const { position, groupId } = getLayerArrangementProps(
          key,
          shiftKey,
          selectedElements,
          pageElements
        );

        if (position || groupId) {
          arrangeSelection({ position, groupId });
        }
      }
    },
    [arrangeSelection, selectedElements, pageElements]
  );

  // Edit mode
  useGlobalKeyDownEffect(
    { key: 'enter', clickable: false },
    () => {
      if (selectedElements.length !== 1) {
        return;
      }

      const { type, id, isLocked } = selectedElements[0];
      const { hasEditMode, hasEditModeIfLocked } = getDefinitionForType(type);
      // Only handle Enter key for editable elements
      if (!hasEditMode || (!hasEditModeIfLocked && isLocked)) {
        return;
      }

      setEditingElement(id);
    },
    [selectedElements, setEditingElement]
  );

  const cloneHandler = useCallback(() => {
    if (selectedElements.length === 0) {
      return;
    }

    for (const el of selectedElements) {
      if (elementIs.product(el)) {
        const { product } = el;
        const { productId, productTitle, productImages } = product;
        if (productId && currentPageProductIds?.includes(productId)) {
          showSnackbar({
            message: sprintf(
              /* translators: %s: product title. */
              __('Product "%s" already exists on the page.', 'web-stories'),
              productTitle
            ),
            thumbnail: productImages?.[0]?.url
              ? {
                  src: productImages[0].url,
                  alt: productImages[0].alt,
                }
              : undefined,
          });
        }
      }
    }

    duplicateElementsById({
      elementIds: selectedElements.map((element) => element.id),
    });
  }, [
    duplicateElementsById,
    selectedElements,
    currentPageProductIds,
    showSnackbar,
  ]);

  useGlobalKeyDownEffect('clone', () => cloneHandler(), [cloneHandler]);

  const isPlaying = [
    StoryAnimationState.Playing,
    StoryAnimationState.PlayingSelected,
  ].includes(animationState);
  useGlobalKeyDownEffect(
    { key: ['mod+enter'] },
    (evt) => {
      evt.preventDefault();
      if (currentPageNumber === 1) {
        return;
      }
      updateAnimationState({
        animationState: isPlaying
          ? StoryAnimationState.Reset
          : StoryAnimationState.Playing,
      });

      void trackEvent('canvas_play_animations', {
        status: isPlaying ? 'stop' : 'play',
      });
    },
    [isPlaying, updateAnimationState, currentPageNumber]
  );

  useGlobalKeyDownEffect(
    { key: ['mod+k'] },
    (evt) => {
      evt.preventDefault();
      if (
        !selectedElements.length ||
        (elementIs.backgroundable(selectedElements[0]) &&
          selectedElements[0].isBackground)
      ) {
        return;
      }
      setHighlights({
        elements: selectedElements,
        highlight: states.Link,
      });
    },
    [setHighlights, selectedElements]
  );
}

export default useCanvasKeys;
