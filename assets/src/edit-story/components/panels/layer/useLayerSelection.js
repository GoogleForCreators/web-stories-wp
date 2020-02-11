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
import {
  useState,
  useCallback,
  useEffect,
  useContext,
  useRef,
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import LayerContext from './context';

function useLayerSelection(element) {
  const { type, id: elementId, position: currentPosition } = element;

  const isBackground = type === 'background';
  const backgroundHasElement = Boolean(element.inner);
  const elementInnerId =
    isBackground && backgroundHasElement ? element.inner.id : null;

  const [dragTarget, setDragTarget] = useState(null);
  const {
    state: { currentSeparator },
    actions: { setIsReordering, setCurrentSeparator },
  } = useContext(LayerContext);

  const {
    state: { currentPage, selectedElementIds },
    actions: {
      arrangeElement,
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

        if (!evt.shiftKey) {
          setDragTarget(evt.target);
        }
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

  const separator = useRef(null);
  useEffect(() => {
    separator.current = currentSeparator;
  }, [currentSeparator]);

  useEffect(() => {
    if (!dragTarget) {
      return undefined;
    }

    const onRelease = (evt) => {
      evt.preventDefault();
      if (separator.current !== null) {
        const newPosition = separator.current;
        const position =
          newPosition > currentPosition ? newPosition - 1 : newPosition;
        arrangeElement({ elementId, position });
      }
      setDragTarget(null);
    };

    // only mark as reordering when starting to drag
    const onMove = () => setIsReordering(true);

    // abort on esc
    const onAbort = (evt) => {
      if (evt.key === 'Escape') {
        setDragTarget(null);
      }
    };

    dragTarget.ownerDocument.addEventListener('pointerup', onRelease);
    dragTarget.ownerDocument.addEventListener('keydown', onAbort);
    dragTarget.addEventListener('pointermove', onMove);

    return () => {
      setCurrentSeparator(null);
      setIsReordering(false);
      dragTarget.removeEventListener('pointermove', onMove);
      dragTarget.ownerDocument.removeEventListener('pointerup', onRelease);
      dragTarget.ownerDocument.removeEventListener('keydown', onAbort);
    };
  }, [
    dragTarget,
    currentPosition,
    elementId,
    setCurrentSeparator,
    setIsReordering,
    arrangeElement,
  ]);

  return { isSelected, handleClick };
}

export default useLayerSelection;
