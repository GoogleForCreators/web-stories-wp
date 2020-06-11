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
import { useCallback, useEffect, MutableRefObject } from 'react';
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
 * @param {MutableRefObject<HTMLElement | null>} ref
 */
function useCanvasKeys(ref) {
  const {
    selectedElements,
    addElements,
    arrangeSelection,
    clearSelection,
    deleteSelectedElements,
    updateSelectedElements,
  } = useStory(
    ({
      state: { selectedElements },
      actions: {
        addElements,
        arrangeSelection,
        clearSelection,
        deleteSelectedElements,
        updateSelectedElements,
      },
    }) => {
      return {
        selectedElements,
        addElements,
        arrangeSelection,
        clearSelection,
        deleteSelectedElements,
        updateSelectedElements,
      };
    }
  );

  /**
   * Sets default focus node from body to the ref element.
   */
  useEffect(() => {
    const container = ref.current;
    if (!container) {
      return undefined;
    }
    /**
     * If node loses focus, wait to see if another node gains it.
     * if not focus default element.
     */
    const doc = container.ownerDocument;
    const handler = () => {
      /**
       * setTimeout places callback in the back of the IO queue after
       * any postential focusin events are queued.
       */
      setTimeout(() => {
        if (doc.activeElement === doc.body) {
          container.focus();
        }
      }, 0);
    };
    /**
     * This is necessary on first load as no events will fire and
     * we need to check to see if we need to swap out the default
     * focus element.
     */
    handler();
    /**
     * focusout is the only reliable event to listen to here
     * as focusin is not fired when the body gains focus after
     * another node loses it.
     */
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
