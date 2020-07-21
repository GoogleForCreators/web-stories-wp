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
import { useLayoutEffect, useState, useRef } from 'react';

function useContainerScrolling() {
  const containerRef = useRef();
  // State and callback ref necessary to recalculate the padding of the list
  //  given the scrollbar width.
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const setContainer = (element) => {
    containerRef.current = element;
    if (!element) {
      return;
    }
    setScrollbarWidth(element.offsetWidth - element.clientWidth);
  };

  // Recalculates padding while keeping the element centered.
  // As of May 2020 this cannot be achieved without js (as the scrollbar-gutter
  // prop is not yet ready).
  useLayoutEffect(() => {
    if (!scrollbarWidth) {
      return;
    }
    const currentPaddingLeft = parseFloat(
      window
        .getComputedStyle(containerRef.current, null)
        .getPropertyValue('padding-left')
    );
    containerRef.current.style['padding-right'] =
      currentPaddingLeft - scrollbarWidth + 'px';
  }, [scrollbarWidth, containerRef]);

  return {
    containerRef,
    setContainer,
  };
}

export default useContainerScrolling;
