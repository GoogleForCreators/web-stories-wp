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
import { useCallback, useState, useLayoutEffect } from 'react';

/**
 * Internal dependencies
 */
import { useConfig } from '../../app';

function useCarouselScroll({ listElement, carouselWidth, hasOverflow }) {
  const [ratio, setRatio] = useState(0);
  const { isRTL } = useConfig();

  const scroll = useCallback(
    (offset) => {
      if (isRTL) {
        offset *= -1;
      }

      if (!listElement.scrollBy) {
        listElement.scrollLeft += offset;
        return;
      }

      listElement.scrollBy({
        left: offset,
        behavior: 'smooth',
      });
    },
    [listElement, isRTL]
  );

  const scrollByPx = carouselWidth;
  const isAtStart = isRTL ? 1 === ratio : 0 === ratio;
  const isAtEnd = isRTL ? 0 === ratio : 1 === ratio;

  const canScrollBack = hasOverflow && !isAtStart;
  const canScrollForward = hasOverflow && !isAtEnd;

  const scrollForward = useCallback(() => scroll(scrollByPx), [
    scroll,
    scrollByPx,
  ]);
  const scrollBack = useCallback(() => scroll(-scrollByPx), [
    scroll,
    scrollByPx,
  ]);

  useLayoutEffect(() => {
    if (!hasOverflow || !listElement) {
      return undefined;
    }

    const handleScroll = () => {
      const { offsetWidth, scrollLeft, scrollWidth } = listElement;
      const max = scrollWidth - offsetWidth;
      setRatio(scrollLeft / max);
    };

    listElement.addEventListener('scroll', handleScroll, { passive: true });
    return () => listElement.removeEventListener('scroll', handleScroll);
  }, [listElement, hasOverflow]);

  return {
    canScrollBack,
    canScrollForward,
    scrollForward,
    scrollBack,
  };
}
export default useCarouselScroll;
