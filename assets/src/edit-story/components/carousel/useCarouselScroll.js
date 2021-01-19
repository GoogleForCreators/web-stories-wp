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
import { useConfig, useStory } from '../../app';

function useCarouselScroll({
  listElement,
  carouselWidth,
  hasOverflow,
  showablePages,
  pageThumbWidth,
  pageThumbMargin,
}) {
  const [ratio, setRatio] = useState(0);
  const { isRTL } = useConfig();
  const { currentPageIndex } = useStory(
    ({ state: { currentPageId, pages } }) => ({
      currentPageIndex: pages.findIndex(({ id }) => id === currentPageId),
    })
  );

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

  // This effects handles setting the scroll ratio, which is need to
  // enable and disable the scroll arrows correctly.
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

  const getOffsetFromIndex = useCallback(
    (index) => (pageThumbWidth + pageThumbMargin) * index,
    [pageThumbWidth, pageThumbMargin]
  );

  // This effect makes sure, that whenever the current page changes, it'll be in focus
  // Note that it doesn't run just because the current page is updated (some element
  // added or removed to page). Only when the actual for the current page is updated
  // (because a page is added or deleted or user navigate to another page), this runs.
  useLayoutEffect(() => {
    if (!hasOverflow || !listElement) {
      return undefined;
    }

    const { scrollLeft } = listElement;

    // If scrolled to the start, what is the min index of the first visible page
    // in order for the current page to be at the very end of the current scoll
    const minVisiblePageIndex = Math.max(
      0,
      currentPageIndex - showablePages + 1
    );
    // If scrolled to the very end, the current page must be the first visible page
    const maxVisiblePageIndex = currentPageIndex;
    // Convert these to scroll numbers
    const minOffset = getOffsetFromIndex(minVisiblePageIndex);
    const maxOffset = getOffsetFromIndex(maxVisiblePageIndex);

    if (scrollLeft >= minOffset && scrollLeft <= maxOffset) {
      // Page is already visible
      return undefined;
    }

    // Scroll so that current page is visible with least amount of delta needed
    const targetLeft = scrollLeft < minOffset ? minOffset : maxOffset;
    const doScroll = () => {
      // However, if at the end of container, new page might not have been added yet.
      const maxScroll = listElement.scrollWidth - listElement.offsetWidth;
      // If so, wait a bit
      if (maxScroll < targetLeft) {
        return;
      }
      // Otherwise, do scroll and cancel interval
      listElement.scrollTo({
        left: targetLeft,
        top: 0,
        behavior: 'smooth',
      });
      clearInterval(retry);
    };
    const retry = setInterval(doScroll, 100);
    return () => clearInterval(retry);
  }, [
    listElement,
    hasOverflow,
    currentPageIndex,
    showablePages,
    getOffsetFromIndex,
  ]);

  return {
    canScrollBack,
    canScrollForward,
    scrollForward,
    scrollBack,
  };
}
export default useCarouselScroll;
