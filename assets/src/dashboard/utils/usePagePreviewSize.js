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
import { useEffect, useMemo, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

/**
 * Internal dependencies
 */
import theme from '../theme';
import {
  DASHBOARD_LEFT_NAV_WIDTH,
  PAGE_RATIO,
  VIEWPORT_WP_LEFT_NAV_HIDES,
  WP_LEFT_NAV_WIDTH,
} from '../constants/pageStructure';

const descendingBreakpointKeys = Object.keys(theme.breakpoint.raw).sort(
  (a, b) => theme.breakpoint.raw[b] - theme.breakpoint.raw[a]
);
const getCurrentBp = (availableContainerSpace) =>
  descendingBreakpointKeys.reduce((current, bp) => {
    return availableContainerSpace <= theme.breakpoint.raw[bp] ? bp : current;
  }, descendingBreakpointKeys[0]);

// To determine the size of a story page we take the default page size according to breakpoint
// and then find the remaining width in the given space that the dashboard is showing stories in
// if the container isn't important to size then respectSetWidth catches it (thumbnails or isn't a grid)
// otherwise, we're taking the available space we have and finding out how many items in the default size we can fit in a row
// then we calculate the grid column gutter and the page gutter
// subtract those values from the availableContainer space to get remaining space
// divide the remaining space by the itemsInRow
// attach that extra space to the width
// get height by dividing new with by PAGE_RATIO
const sizeFromWidth = (
  width,
  { bp, respectSetWidth, availableContainerSpace }
) => {
  if (respectSetWidth) {
    return { width, height: width / PAGE_RATIO };
  }
  const itemsInRow = Math.floor(availableContainerSpace / width);
  const columnGapWidth = theme.grid.columnGap[bp] * (itemsInRow - 1);
  const pageGutter = theme.standardViewContentGutter[bp] * 2;
  const takenSpace = width * itemsInRow + columnGapWidth + pageGutter;
  const remainingSpace = availableContainerSpace - takenSpace;
  const addToWidthValue = remainingSpace / itemsInRow;

  const trueWidth = width + addToWidthValue;
  return {
    width: trueWidth,
    height: trueWidth / PAGE_RATIO,
  };
};

// we want to set the size of story pages based on the available space
// this means we need to take the window.innerWidth value and remove the built in WP nav and the dashboard nav according to breakpoints
const getTrueInnerWidth = () => {
  const { innerWidth } = window;
  if (innerWidth >= theme.breakpoint.raw.tablet) {
    return innerWidth - WP_LEFT_NAV_WIDTH - DASHBOARD_LEFT_NAV_WIDTH;
  } else if (innerWidth < VIEWPORT_WP_LEFT_NAV_HIDES) {
    return innerWidth;
  } else {
    return innerWidth - WP_LEFT_NAV_WIDTH;
  }
};

export default function usePagePreviewSize(options = {}) {
  const { thumbnailMode = false, isGrid } = options;
  const [availableContainerSpace, setAvailableContainerSpace] = useState(
    getTrueInnerWidth()
  );

  const [debounceAvailableContainerSpace] = useDebouncedCallback(() => {
    setAvailableContainerSpace(getTrueInnerWidth());
  }, 250);

  const [bp, setBp] = useState(getCurrentBp(availableContainerSpace));

  useEffect(() => {
    if (thumbnailMode) {
      return () => {};
    }

    const handleResize = () => debounceAvailableContainerSpace();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [thumbnailMode, debounceAvailableContainerSpace]);

  useEffect(() => setBp(getCurrentBp(availableContainerSpace)), [
    availableContainerSpace,
  ]);

  return useMemo(
    () => ({
      pageSize: sizeFromWidth(
        theme.previewWidth[thumbnailMode ? 'thumbnail' : bp],
        {
          respectSetWidth: !isGrid || thumbnailMode,
          availableContainerSpace,
          bp,
        }
      ),
    }),
    [bp, isGrid, thumbnailMode, availableContainerSpace]
  );
}
