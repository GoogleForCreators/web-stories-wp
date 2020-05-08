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
import { useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { useGlobalKeyDownEffect, useKeyDownEffect } from '../keyboard';
import { useStory } from '../../app';
import { LAYER_DIRECTIONS } from '../../constants';
import { getPastedCoordinates } from '../../utils/copyPaste';

const MOVE_COARSE_STEP = 10;

/**
 * @param {{current: Node}} ref
 */
function useCanvasKeys(ref) {
  const {
    actions: {
      addElements,
      arrangeSelection,
      clearSelection,
      deleteSelectedElements,
      updateSelectedElements,
    },
    state: { selectedElements },
  } = useStory();

  // Return focus back to the canvas when another section loses the focus.
  useEffect(() => {
    const container = ref.current;
    if (!container) {
      return undefined;
    }

    const doc = container.ownerDocument;

    const handler = (evt) => {
      if (!container.contains(evt.target)) {
        // Make sure that no other component is trying to get the focus
        // at this time.
        setTimeout(() => {
          if (doc.activeElement === doc.body) {
            container.focus();
          }
        }, 300);
      }
    };
    doc.addEventListener('focusout', handler, true);
    return () => {
      doc.removeEventListener('focusout', handler, true);
    };
  }, [ref]);

  useKeyDownEffect(ref, 'delete', () => deleteSelectedElements(), [
    deleteSelectedElements,
  ]);
  useKeyDownEffect(ref, 'esc', () => clearSelection(), [clearSelection]);

  // Position (x/y) key handler.
  useKeyDownEffect(
    ref,
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
  useKeyDownEffect(
    ref,
    { key: ['mod+up', 'mod+down'], shift: true },
    ({ key, shiftKey }) =>
      arrangeSelection({ position: getLayerDirection(key, shiftKey) }),
    [arrangeSelection]
  );

  const cloneHandler = useCallback(() => {
    if (selectedElements.length === 0) {
      return;
    }
    const clonedElements = selectedElements.map(({ id, x, y, ...rest }) => {
      return {
        ...getPastedCoordinates(x, y),
        id: uuidv4(),
        basedOn: id,
        ...rest,
      };
    });
    addElements({ elements: clonedElements });
  }, [addElements, selectedElements]);

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
