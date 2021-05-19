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
import { useCallback, useLayoutEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

/**
 * Internal dependencies
 */
import { useLayout } from '../../app/layout';

function usePinchToZoom({ containerRef }) {
  const { zoomLevel, setZoomLevel } = useLayout(
    ({ state: { zoomLevel }, actions: { setZoomLevel } }) => ({
      zoomLevel,
      setZoomLevel,
    })
  );

  const [handleZoom] = useDebouncedCallback(
    (level) => setZoomLevel(level),
    50,
    [setZoomLevel]
  );

  const onWheel = useCallback(
    (e) => {
      const { ctrlKey, deltaY } = e;
      const node = containerRef.current.childNodes[0];
      if (ctrlKey && node.contains(e.target) && deltaY) {
        // Zoom by 25% steps. This is due to performance reasons and could be followed up later.
        // Ideally we'd use transform: scale locally and update only when the event finishes, however,
        // there are too many other pieces that would need adjustment as well.
        const newZoom = zoomLevel - deltaY * 0.01;
        if (Math.abs(newZoom - zoomLevel) >= 0.01) {
          const newStepZoom = deltaY > 0 ? zoomLevel - 0.25 : zoomLevel + 0.25;
          handleZoom(
            Math.min(3, Math.max(0.25, newStepZoom - (newStepZoom % 0.25)))
          );
        }
        e.preventDefault();
      }
    },
    [containerRef, zoomLevel, handleZoom]
  );

  const preventDefault = useCallback(
    (e) => {
      const node = containerRef.current.childNodes[0];
      if (node.contains(e.target)) {
        e.preventDefault();
      }
    },
    [containerRef]
  );

  const handleGestureChange = useCallback(
    (e) => {
      const node = containerRef.current.childNodes[0];
      const { scale } = e;
      if (node.contains(e.target) && scale) {
        const newStepZoom = scale < 1 ? zoomLevel - 0.25 : zoomLevel + 0.25;
        handleZoom(
          Math.min(3, Math.max(0.25, newStepZoom - (newStepZoom % 0.25)))
        );
        e.preventDefault();
      }
    },
    [containerRef, handleZoom, zoomLevel]
  );

  useLayoutEffect(() => {
    if (containerRef.current) {
      document.addEventListener('wheel', onWheel, { passive: false });
      // Safari.
      document.addEventListener('gesturestart', preventDefault);
      document.addEventListener('gestureend', preventDefault);
      document.addEventListener('gesturechange', handleGestureChange);
    }
    return () => {
      document.removeEventListener('wheel', onWheel, { passive: false });
      // Safari
      document.removeEventListener('gesturestart', preventDefault);
      document.removeEventListener('gestureend', preventDefault);
      document.removeEventListener('gesturechange', handleGestureChange);
    };
  }, [onWheel, containerRef, preventDefault, handleGestureChange]);
}

export default usePinchToZoom;
