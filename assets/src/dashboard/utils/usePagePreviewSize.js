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
import { useResizeEffect } from '../../design-system';
import theme from '../theme';
import {
  DASHBOARD_LEFT_NAV_WIDTH,
  FULLBLEED_RATIO,
  PAGE_RATIO,
  WPBODY_ID,
} from '../constants';

/**
 * Here we need to calculate two heights for every pagePreview in use.
 * 1. The height that is 9:16 aspect ratio, this is the default FULLBLEED_RATIO
 * This height is used anywhere we need the height of the container holding a pagePreview.
 * It is the true boundary for overflow.
 * It is the 'fullBleedHeight'
 * 2. The height for the actual story, used in our shared components with edit-story
 * This means things like the unitsProvider and displayElements that we import to the Dashboard from the editor
 * It's maintaining a 2:3 aspect ratio.
 * When fullbleed is visible (as it is for our reqs) we use the 2:3 aspect ratio w/ overflow to allow the fullBleed height to be visible
 *
 * @param {number} width  width of page to base ratios on
 * @return {Object}       heights to use in pagePreviews { fullBleedHeight: Number, storyHeight: Number}
 */
export const getPagePreviewHeights = (width) => {
  const fullBleedHeight = Math.round((width / FULLBLEED_RATIO) * 100) / 100;
  const storyHeight = Math.round((width / PAGE_RATIO) * 100) / 100;

  return { fullBleedHeight, storyHeight };
};

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
// get heights for page and container in getPagePreviewHeights
const sizeFromWidth = (
  width,
  { bp, respectSetWidth, availableContainerSpace }
) => {
  if (respectSetWidth) {
    const { fullBleedHeight, storyHeight } = getPagePreviewHeights(width);
    return { width, height: storyHeight, containerHeight: fullBleedHeight };
  }

  if (bp === 'desktop') {
    availableContainerSpace -= DASHBOARD_LEFT_NAV_WIDTH;
  }

  const itemsInRow = Math.floor(availableContainerSpace / width);
  const columnGapWidth = theme.grid.columnGap[bp] * (itemsInRow - 1);
  const pageGutter = theme.standardViewContentGutter[bp] * 2;
  const takenSpace = width * itemsInRow + columnGapWidth + pageGutter;
  const remainingSpace = availableContainerSpace - takenSpace;
  const addToWidthValue = remainingSpace / itemsInRow;

  const trueWidth = width + addToWidthValue;
  const { fullBleedHeight, storyHeight } = getPagePreviewHeights(trueWidth);

  return {
    width: trueWidth,
    height: storyHeight,
    containerHeight: fullBleedHeight,
  };
};

export default function usePagePreviewSize(options = {}) {
  const { thumbnailMode = false, isGrid } = options;
  // When the dashboard is pulled out of wordpress this id will need to be updated.
  // For now, we need to grab wordpress instead because of how the app's rendered
  const dashboardContainerRef = useRef(document.getElementById(WPBODY_ID));
  // BP is contingent on the actual window size
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [bp, setBp] = useState(getCurrentBp(viewportWidth));

  const [availableContainerSpace, setAvailableContainerSpace] = useState(
    dashboardContainerRef.current?.offsetWidth || window.innerWidth
  );

  const [debounceSetViewportWidth] = useDebouncedCallback((width) => {
    setViewportWidth(width);
  }, 500);

  useEffect(() => {
    setBp(getCurrentBp(viewportWidth));
  }, [viewportWidth]);

  useResizeEffect(
    dashboardContainerRef,
    ({ width }) => {
      setAvailableContainerSpace(width);

      if (window.innerWidth !== viewportWidth) {
        debounceSetViewportWidth(window.innerWidth);
      }
    },
    [setAvailableContainerSpace, viewportWidth, debounceSetViewportWidth]
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
