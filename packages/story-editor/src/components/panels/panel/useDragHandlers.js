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
import { useRef, useState, useCallback, useLayoutEffect } from 'react';

function useDragHandlers(handle, onDrag, onDragEnd) {
  const lastPosition = useRef();
  const [isDragging, setIsDragging] = useState(false);

  // On pointer move, check difference since last record vertical pointer position
  // and invoke callback with this difference.
  // Then record new vertical pointer position for next iteration.
  const handlePointerMove = useCallback(
    (evt) => {
      const delta = lastPosition.current - evt.pageY;
      onDrag(delta);
      lastPosition.current = evt.pageY;
    },
    [onDrag]
  );

  // On pointer up, set dragging as false
  // - will cause useLayoutEffect to unregister listeners.
  const handlePointerUp = useCallback(
    (evt) => {
      evt.target.releasePointerCapture(evt.pointerId);
      setIsDragging(false);
      onDragEnd();
    },
    [onDragEnd]
  );

  // On pointer down, set dragging as true
  // - will cause useLayoutEffect to register listeners.
  // Also record the initial vertical pointer position on the page.
  const handlePointerDown = useCallback((evt) => {
    evt.target.setPointerCapture(evt.pointerId);
    lastPosition.current = evt.pageY;
    setIsDragging(true);
  }, []);

  // On initial render *and* every time `isDragging` changes value,
  // register all relevant listeners. Note that all listeners registered
  // will be correctly unregistered due to the cleanup function.
  useLayoutEffect(() => {
    const element = handle.current;
    element.addEventListener('pointerdown', handlePointerDown);

    if (isDragging) {
      element.addEventListener('pointermove', handlePointerMove);
      element.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      element.removeEventListener('pointerdown', handlePointerDown);

      if (isDragging) {
        element.removeEventListener('pointermove', handlePointerMove);
        element.removeEventListener('pointerup', handlePointerUp);
      }
    };
  }, [
    isDragging,
    handlePointerUp,
    handlePointerMove,
    handlePointerDown,
    handle,
  ]);
}

export default useDragHandlers;
