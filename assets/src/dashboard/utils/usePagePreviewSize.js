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
import { useEffect, useMemo, useState, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';

/**
 * Internal dependencies
 */
import theme from '../theme';
import {
  DASHBOARD_LEFT_NAV_WIDTH,
  PAGE_RATIO,
  TOP_LEVEL_DASHBOARD_APP_ID,
} from '../constants';
import { useResizeEffect } from './';

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
const getTrueInnerWidth = (availableWindowWidth = window.innerWidth) => {
  if (availableWindowWidth >= theme.breakpoint.raw.tablet) {
    return availableWindowWidth - DASHBOARD_LEFT_NAV_WIDTH;
  } else {
    return availableWindowWidth;
  }
};

export default function usePagePreviewSize(options = {}) {
  const { thumbnailMode = false, isGrid } = options;
  const dashboardContainerRef = useRef(
    document.getElementById(TOP_LEVEL_DASHBOARD_APP_ID)
  );
  const [availableContainerSpace, setAvailableContainerSpace] = useState(
    getTrueInnerWidth(dashboardContainerRef.current?.offsetWidth)
  );
  const [bp, setBp] = useState(getCurrentBp(availableContainerSpace));

  const [debounceAvailableContainerSpace] = useDebouncedCallback((newWidth) => {
    setAvailableContainerSpace(newWidth);
  }, 250);

  useEffect(() => {
    setBp(getCurrentBp(availableContainerSpace));
  }, [availableContainerSpace]);

  useResizeEffect(
    dashboardContainerRef,
    (dashboardContainerRefCurrent) => {
      debounceAvailableContainerSpace(
        getTrueInnerWidth(dashboardContainerRefCurrent.width)
      );
    },
    [debounceAvailableContainerSpace]
  );

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
