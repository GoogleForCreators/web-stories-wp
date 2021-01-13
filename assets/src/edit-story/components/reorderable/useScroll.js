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
import { useState, useCallback, useEffect } from 'react';

/**
 * Internal dependencies
 */
import { useBatchingCallback } from '../../../design-system';

const SCROLL_PERCENT = 0.2;
const MAX_SCROLL_STEP = 10;

function useScroll(mode = 'horizontal', isReordering, scrollTarget, size) {
  const [hasScrollAbove, setHasScrollAbove] = useState(false);
  const [hasScrollBelow, setHasScrollBelow] = useState(false);
  const [scrollDirection, setScrollDirection] = useState(0);

  const updateScrollMarkers = useBatchingCallback(() => {
    const node = scrollTarget.current;
    if (!node) {
      return;
    }
    if (mode === 'horizontal') {
      const possibleScroll = node.scrollWidth - node.clientWidth;
      if (possibleScroll <= 0) {
        setHasScrollAbove(false);
        setHasScrollBelow(false);
      } else {
        setHasScrollAbove(node.scrollLeft > 0);
        setHasScrollBelow(node.scrollLeft < possibleScroll);
      }
    } else {
      const possibleScroll = node.scrollHeight - node.clientHeight;
      if (possibleScroll <= 0) {
        setHasScrollAbove(false);
        setHasScrollBelow(false);
      } else {
        setHasScrollAbove(node.scrollTop > 0);
        setHasScrollBelow(node.scrollTop < possibleScroll);
      }
    }
  }, [mode, scrollTarget]);

  const startScroll = useCallback(
    (dir) => {
      setScrollDirection(dir);
      return () => setScrollDirection(0);
    },
    [setScrollDirection]
  );

  const canScrollStart = isReordering && hasScrollAbove;
  const canScrollEnd = isReordering && hasScrollBelow;

  useEffect(() => {
    const isNotScrolling = scrollDirection === 0;
    const isScrollingStart = canScrollStart && scrollDirection < 0;
    const isScrollingEnd = canScrollEnd && scrollDirection > 0;
    const isScrollingAnywhere = isScrollingStart || isScrollingEnd;
    if (isNotScrolling || !isScrollingAnywhere) {
      return undefined;
    }

    let mounted = true;
    const update = () => {
      const scrollStep = Math.max(
        Math.min(SCROLL_PERCENT * size, MAX_SCROLL_STEP),
        0
      );
      if (mode === 'horizontal') {
        scrollTarget.current.scrollLeft += scrollDirection * scrollStep;
      } else {
        scrollTarget.current.scrollTop += scrollDirection * scrollStep;
      }
      updateScrollMarkers();
      if (mounted) {
        window.requestAnimationFrame(update);
      }
    };
    update();

    return () => {
      mounted = false;
    };
  }, [
    scrollDirection,
    updateScrollMarkers,
    canScrollStart,
    canScrollEnd,
    size,
    mode,
    scrollTarget,
  ]);

  // Update scroll markers whenever isReordering changes (to true really, but no harm)
  useEffect(() => updateScrollMarkers(), [isReordering, updateScrollMarkers]);

  return {
    startScroll,
    canScrollEnd,
    canScrollStart,
  };
}

export default useScroll;
