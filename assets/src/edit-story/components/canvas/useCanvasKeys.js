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
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useKeyDownEffect } from '../keyboard';
import { useStory } from '../../app';

/**
 * @param {{current: Node}} ref
 */
function useCanvasKeys(ref) {
  const {
    actions: {
      arrangeSelection,
      clearSelection,
      deleteSelectedElements,
      updateSelectedElements,
    },
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
  useKeyDownEffect(ref, 'escape', () => clearSelection(), [clearSelection]);

  // Position (x/y) key handler.
  useKeyDownEffect(
    ref,
    { key: 'Arrow*', shiftKey: '*', repeat: '*' },
    ({ key, shiftKey }) => {
      const dirX = getArrowDir(key, 'ArrowRight', 'ArrowLeft');
      const dirY = getArrowDir(key, 'ArrowDown', 'ArrowUp');
      const delta = shiftKey ? 1 : 10;
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
    { name: 'layer/up', repeat: '*' },
    () =>
      arrangeSelection({ position: (currentPosition) => currentPosition + 1 }),
    [arrangeSelection]
  );
  useKeyDownEffect(
    ref,
    { name: 'layer/down', repeat: '*' },
    () =>
      arrangeSelection({ position: (currentPosition) => currentPosition - 1 }),
    [arrangeSelection]
  );
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

export default useCanvasKeys;
