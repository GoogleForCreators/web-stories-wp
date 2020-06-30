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
import { useCallback, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { useGlobalKeyDownEffect } from '../keyboard';
import { useStory } from '../../app';
import { LAYER_DIRECTIONS } from '../../constants';
import { getPastedCoordinates } from '../../utils/copyPaste';
import useAddPastedElements from './useAddPastedElements';
import useCanvas from './useCanvas';

const MOVE_COARSE_STEP = 10;

/**
 * @param {{current: Node}} ref
 */
function useCanvasKeys(ref) {
  const addPastedElements = useAddPastedElements();

  const {
    selectedElementIds,
    selectedElements,
    arrangeSelection,
    clearSelection,
    deleteSelectedElements,
    updateSelectedElements,
  } = useStory(
    ({
      state: { selectedElementIds, selectedElements },
      actions: {
        arrangeSelection,
        clearSelection,
        deleteSelectedElements,
        updateSelectedElements,
      },
    }) => {
      return {
        selectedElementIds,
        selectedElements,
        arrangeSelection,
        clearSelection,
        deleteSelectedElements,
        updateSelectedElements,
      };
    }
  );

  const getNodeForElement = useCanvas(
    ({ actions: { getNodeForElement } }) => getNodeForElement
  );
  const selectedElementIdsRef = useRef(null);
  selectedElementIdsRef.current = selectedElementIds;

  // Return focus back to the canvas when another section loses the focus.
  useEffect(() => {
    const container = ref.current;
    if (!container) {
      return undefined;
    }

    const doc = container.ownerDocument;

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
          if (selectedFrame) {
            selectedFrame.focus({ preventScroll: true });
          } else {
            container.focus({ preventScroll: true });
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
  useGlobalKeyDownEffect('esc', () => clearSelection(), [clearSelection]);

  // Position (x/y) key handler.
  useGlobalKeyDownEffect(
    { key: ['up', 'down', 'left', 'right'], shift: true },
    ({ key, shiftKey }) => {
      const dirX = getArrowDir(key, 'ArrowRight', 'ArrowLeft');
      const dirY = getArrowDir(key, 'ArrowDown', 'ArrowUp');
      const delta = shiftKey ? 1 : MOVE_COARSE_STEP;
      updateSelectedElements({
        properties: ({ x, y }) => ({
          x: x + delta * dirX,
          y: y + delta * dirY,
        }),
      });
    },
    [updateSelectedElements]
  );

  // Layer up/down.
  useGlobalKeyDownEffect(
    { key: ['mod+up', 'mod+down', 'mod+left', 'mod+right'], shift: true },
    (evt) => {
      const { key, shiftKey } = evt;

      // Cancel the default behavior of the event: it's very jarring to run
      // into mod+left/right triggering the browser's back/forward navigation.
      evt.preventDefault();

      const layerDir = getLayerDirection(key, shiftKey);
      if (layerDir) {
        arrangeSelection({ position: layerDir });
      }
    },
    [arrangeSelection]
  );

  const cloneHandler = useCallback(() => {
    if (selectedElements.length === 0) {
      return;
    }
    const clonedElements = selectedElements
      // Filter out the background element (never makes sense to clone that)
      .filter(({ isBackground }) => !isBackground)
      .map(({ id, x, y, ...rest }) => {
        return {
          ...getPastedCoordinates(x, y),
          id: uuidv4(),
          basedOn: id,
          ...rest,
        };
      });
    addPastedElements(clonedElements);
  }, [addPastedElements, selectedElements]);

  useGlobalKeyDownEffect('clone', () => cloneHandler(), [cloneHandler]);
}

function getArrowDir(key, pos, neg) {
  if (key === pos) {
    return 1;
  }
  if (key === neg) {
    return -1;
  }
  return 0;
}

function getLayerDirection(key, shift) {
  if (key === 'ArrowUp') {
    return shift ? LAYER_DIRECTIONS.FRONT : LAYER_DIRECTIONS.FORWARD;
  }
  if (key === 'ArrowDown') {
    return shift ? LAYER_DIRECTIONS.BACK : LAYER_DIRECTIONS.BACKWARD;
  }
  return null;
}

export default useCanvasKeys;
