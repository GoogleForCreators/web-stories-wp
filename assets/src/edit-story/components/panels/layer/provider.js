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
import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../../types';
import Context from './context';
import useLayers from './useLayers';

const SCROLL_DISTANCE = 5;

function LayerProvider({ children }) {
  const layers = useLayers();
  const [scrollRatio, setScrollRatio] = useState(null);
  const [isReordering, setIsReordering] = useState(false);
  const [scrollDirection, setScrollDirection] = useState(0);
  const [currentSeparator, setCurrentSeparator] = useState(null);
  const scrollTarget = useRef(null);

  const setScrollTarget = useCallback(
    (node) => (scrollTarget.current = node.parentElement),
    []
  );

  const updateScrollRatio = useCallback(() => {
    const node = scrollTarget.current;
    if (!node) return;
    const possibleScroll = node.scrollHeight - node.clientHeight;
    if (possibleScroll <= 0) {
      setScrollRatio(null);
    } else {
      setScrollRatio(node.scrollTop / possibleScroll);
    }
  }, []);

  const stopScroll = useCallback(() => setScrollDirection(0), [
    setScrollDirection,
  ]);

  const canScrollUp = isReordering && scrollRatio > 0;
  const canScrollDown = isReordering && scrollRatio < 1;

  useEffect(() => {
    const isNotScrolling = scrollDirection === 0;
    const isScrollingUp = canScrollUp && scrollDirection < 0;
    const isScrollingDown = canScrollDown && scrollDirection > 0;
    const isScrollingAnywhere = isScrollingUp || isScrollingDown;
    if (isNotScrolling || !isScrollingAnywhere) {
      return;
    }

    scrollTarget.current.scrollTop += scrollDirection * SCROLL_DISTANCE;
    updateScrollRatio();
  }, [
    scrollDirection,
    updateScrollRatio,
    canScrollUp,
    canScrollDown,
    // scrollRatio is explicitly included here to make this effect re-render
    // on every frame while there is still changes to be made to scroll ratio!
    scrollRatio,
  ]);

  // Update scroll ratio whenever isReordering changes (to true really, but no harm)
  useEffect(() => updateScrollRatio(), [isReordering, updateScrollRatio]);

  const state = {
    state: {
      layers,
      isReordering,
      currentSeparator,
      canScrollUp,
      canScrollDown,
    },
    actions: {
      setIsReordering,
      setCurrentSeparator,
      setScrollTarget,
      startScroll: setScrollDirection,
      stopScroll,
    },
  };

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

LayerProvider.propTypes = {
  children: StoryPropTypes.children,
};

export default LayerProvider;
