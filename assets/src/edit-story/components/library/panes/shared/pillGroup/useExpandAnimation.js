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
import { useLayoutEffect } from 'react';

/**
 * Internal dependencies
 */
import {
  PILL_COLLAPSED_FULL_HEIGHT,
  PILL_BOTTOM_MARGIN,
  PILL_TOP_MARGIN,
} from './constants';

function useExpandAnimation({
  sectionRef,
  innerContainerRef,
  isExpanded,
  setFocusedRowOffset,
}) {
  // Handles expand and contract animation.
  // We calculate the actual height of the categories list, and set its explicit
  // height if it's expanded, in order to have a CSS height transition.
  useLayoutEffect(() => {
    if (!sectionRef.current || !innerContainerRef.current) {
      return;
    }
    let height;
    if (!isExpanded) {
      height = `${PILL_COLLAPSED_FULL_HEIGHT}px`;
    } else {
      height = `${
        innerContainerRef.current.offsetHeight +
        PILL_TOP_MARGIN +
        PILL_BOTTOM_MARGIN
      }px`;
    }
    // Safari has some strange issues with flex-shrink that require setting
    // min-height as well.
    sectionRef.current.style.height = height;
    sectionRef.current.style.minHeight = height;

    setFocusedRowOffset(0);
  }, [sectionRef, innerContainerRef, isExpanded, setFocusedRowOffset]);
}

export default useExpandAnimation;
