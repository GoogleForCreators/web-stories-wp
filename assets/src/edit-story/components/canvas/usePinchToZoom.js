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
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';

/**
 * Internal dependencies
 */
import { useLayout } from '../../app/layout';

function usePinchToZoom({ containerRef }) {
  const { zoomLevel, zoomSetting, setZoomLevel } = useLayout(
    ({ state: { zoomLevel, zoomSetting }, actions: { setZoomLevel } }) => ({
      zoomLevel,
      zoomSetting,
      setZoomLevel,
    })
  );
  const zoomLevelTracker = useRef(zoomLevel);
  const [handleZoom] = useDebouncedCallback(
    () => setZoomLevel(zoomLevelTracker.current),
    50,
    [setZoomLevel]
  );

  useEffect(() => {
    if (zoomLevel !== zoomLevelTracker.current) {
      zoomLevelTracker.current = zoomLevel;
    }
  }, [zoomLevel, zoomSetting]);

  const onWheel = useCallback(
    (e) => {
      const { ctrlKey, deltaY } = e;
      const node = containerRef.current.childNodes[0];
      if (ctrlKey && node.contains(e.target) && deltaY) {
        const movedDiff = zoomLevelTracker.current - deltaY * 0.01;
        zoomLevelTracker.current = Math.min(3, Math.max(0.25, movedDiff));
        if (Math.abs(movedDiff - zoomLevel) >= 0.04) {
          handleZoom();
        }
        e.preventDefault();
      }
    },
    [containerRef, zoomLevel, handleZoom]
  );

  useLayoutEffect(() => {
    if (containerRef.current) {
      document.addEventListener('wheel', onWheel, { passive: false });
    }
    return () =>
      document.removeEventListener('wheel', onWheel, { passive: false });
  }, [onWheel, containerRef]);
}

export default usePinchToZoom;
