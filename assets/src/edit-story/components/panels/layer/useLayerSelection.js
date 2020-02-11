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
 * WordPress dependencies
 */
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';

function useLayerSelection(element) {
  const { type, id: elementId } = element;

  const isBackground = type === 'background';
  const backgroundHasElement = Boolean(element.inner);
  const elementInnerId =
    isBackground && backgroundHasElement ? element.inner.id : null;

  const {
    state: { currentPage, selectedElementIds },
    actions: {
      setSelectedElementsById,
      toggleElementInSelection,
      clearSelection,
    },
  } = useStory();

  let isSelected;
  if (isBackground) {
    isSelected = backgroundHasElement
      ? selectedElementIds.includes(element.inner.id)
      : selectedElementIds.length === 0;
  } else {
    isSelected = selectedElementIds.includes(element.id);
  }

  const pageElementIds = currentPage.elements.map(({ id }) => id);

  const handleClick = useCallback(
    (evt) => {
      const hasSelection = selectedElementIds.length > 0;

      evt.preventDefault();
      evt.stopPropagation();
      if (isBackground) {
        // If background layer is clicked either select nothing or select only background element
        if (backgroundHasElement) {
          setSelectedElementsById({ elementIds: [elementInnerId] });
        } else {
          clearSelection();
        }
      } else if (evt.shiftKey && hasSelection) {
        // Shift key pressed with any element selected:
        // select everything between this layer and the first selected layer
        const firstId = selectedElementIds[0];
        const firstIndex = pageElementIds.findIndex((id) => id === firstId);
        const clickedIndex = pageElementIds.findIndex((id) => id === elementId);
        const lowerIndex = Math.min(firstIndex, clickedIndex);
        const higherIndex = Math.max(firstIndex, clickedIndex);
        const elementIds = pageElementIds.slice(lowerIndex, higherIndex + 1);
        // reverse selection if firstId isn't first anymore
        if (firstId !== elementIds[0]) {
          elementIds.reverse();
        }
        setSelectedElementsById({ elementIds });
      } else if (evt.metaKey) {
        // Meta pressed. Toggle this layer in the selection.
        toggleElementInSelection({ elementId });
      } else {
        // No special key pressed - just selected this layer and nothing else.
        setSelectedElementsById({ elementIds: [elementId] });
      }
    },
    [
      pageElementIds,
      selectedElementIds,
      setSelectedElementsById,
      toggleElementInSelection,
      clearSelection,
      elementId,
      elementInnerId,
      isBackground,
      backgroundHasElement,
    ]
  );

  return { isSelected, handleClick };
}

export default useLayerSelection;
