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
import { useState, useCallback, useEffect, useContext, useRef } from 'react';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import LayerContext from './context';

function useLayerReordering(layer) {
  const { type, id: elementId, position: currentPosition } = layer;

  const isBackground = type === 'background';

  const [dragTarget, setDragTarget] = useState(null);
  const {
    state: { currentSeparator },
    actions: { setIsReordering, setCurrentSeparator },
  } = useContext(LayerContext);

  const {
    actions: { arrangeElement, setSelectedElementsById },
  } = useStory();

  const handleStartReordering = useCallback(
    (evt) => {
      // Only allow reordering with non-modified click on non-background element.
      // Modified (shift+ or meta+) clicks are for selection and handled in `useLayerSelection`.
      if (!isBackground && !evt.shiftKey && !evt.metaKey) {
        setSelectedElementsById({ elementIds: [elementId] });
        setDragTarget(evt.target);
      }
    },
    [isBackground, elementId, setSelectedElementsById]
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
    // TODO: rewrite to useKeyDown() once either is merged.
    const onAbort = (evt) => {
      if (evt.key === 'Escape') {
        setDragTarget(null);
        evt.stopPropagation();
      }
    };

    dragTarget.ownerDocument.addEventListener('pointerup', onRelease);
    dragTarget.ownerDocument.addEventListener('keydown', onAbort, true);
    dragTarget.addEventListener('pointermove', onMove);

    return () => {
      setCurrentSeparator(null);
      setIsReordering(false);
      dragTarget.removeEventListener('pointermove', onMove);
      dragTarget.ownerDocument.removeEventListener('pointerup', onRelease);
      dragTarget.ownerDocument.removeEventListener('keydown', onAbort, true);
    };
  }, [
    dragTarget,
    currentPosition,
    elementId,
    setCurrentSeparator,
    setIsReordering,
    arrangeElement,
  ]);

  return { handleStartReordering };
}

export default useLayerReordering;
