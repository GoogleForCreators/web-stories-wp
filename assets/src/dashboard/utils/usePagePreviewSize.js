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
import { useDebouncedCallback, useResizeEffect } from '@web-stories-wp/react';
import { FULLBLEED_RATIO, PAGE_RATIO } from '@web-stories-wp/units';

/**
 * Internal dependencies
 */
import {
  DASHBOARD_LEFT_NAV_WIDTH,
  MIN_DASHBOARD_WIDTH,
  WPBODY_ID,
  VIEWPORT_BREAKPOINT,
  STORY_PREVIEW_WIDTH,
  GRID_SPACING,
  PAGE_WRAPPER,
} from '../constants';

/**
 * Here we need to calculate three heights for every pagePreview in use.
 * 1. fullbleedHeight - The height that is 9:16 aspect ratio, this is the default FULLBLEED_RATIO
 * This height is used anywhere we need the height of the container holding a pagePreview.
 * It is the true boundary for overflow.
 * It is the 'fullBleedHeight'
 * 2. storyHeight - The height for the actual story (in the dashboard the only actual stories rendered are the templates), used in our shared components with edit-story
 * This means things like the unitsProvider and displayElements that we import to the Dashboard from the editor
 * It's maintaining a 2:3 aspect ratio.
 * When fullbleed is visible (as it is for templates) we use the 2:3 aspect ratio w/ overflow to allow the fullBleed height to be visible
 * 3. posterHeight - This is a height based on 3:4 ratio which is what poster images need, this is used on 'my stories' view.
 *
 * @param {number} width  width of page to base ratios on
 * @return {Object}       heights to use in pagePreviews { fullBleedHeight: Number, storyHeight: Number}
 */
export const getPagePreviewHeights = (width) => {
  const fullBleedHeight = Math.round((width / FULLBLEED_RATIO) * 100) / 100;
  const storyHeight = Math.round((width / PAGE_RATIO) * 100) / 100;
  const posterHeight = Math.round(((width / (3 / 4)) * 100) / 100);
  return { fullBleedHeight, storyHeight, posterHeight };
};

const getCurrentBp = (availableContainerSpace) =>
  availableContainerSpace <= MIN_DASHBOARD_WIDTH
    ? VIEWPORT_BREAKPOINT.TABLET
    : VIEWPORT_BREAKPOINT.DESKTOP;

// To determine the size of a story page we take the page size according to min viewport width
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
    const { fullBleedHeight, storyHeight, posterHeight } =
      getPagePreviewHeights(width);
    return {
      width,
      height: storyHeight,
      containerHeight: fullBleedHeight,
      posterHeight,
    };
  }

  if (bp === VIEWPORT_BREAKPOINT.DESKTOP) {
    availableContainerSpace -= DASHBOARD_LEFT_NAV_WIDTH;
  }

  const itemsInRow = Math.floor(availableContainerSpace / width);
  const columnGapWidth = GRID_SPACING.COLUMN_GAP * (itemsInRow - 1);
  const pageGutter = PAGE_WRAPPER.GUTTER * 2;
  const takenSpace = width * itemsInRow + columnGapWidth + pageGutter;
  const remainingSpace = availableContainerSpace - takenSpace;
  const addToWidthValue = remainingSpace / itemsInRow;

  const trueWidth = width + addToWidthValue;
  const { fullBleedHeight, storyHeight, posterHeight } =
    getPagePreviewHeights(trueWidth);

  return {
    width: trueWidth,
    height: storyHeight,
    containerHeight: fullBleedHeight,
    posterHeight,
  };
};

const getContainerWidth = (windowWidth) => {
  // Because the dashboard has a min width (MIN_DASHBOARD_WIDTH) check to see if that min should be used or the actual space of the dashboard
  const isWindowSmallerThanMinDashboardWidth =
    window.innerWidth < MIN_DASHBOARD_WIDTH;
  return isWindowSmallerThanMinDashboardWidth
    ? MIN_DASHBOARD_WIDTH
    : windowWidth;
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
    getContainerWidth(
      dashboardContainerRef.current?.offsetWidth || window.innerWidth
    )
  );

  const debounceSetViewportWidth = useDebouncedCallback((width) => {
    setViewportWidth(width);
  }, 500);

  useEffect(() => {
    setBp(getCurrentBp(viewportWidth));
  }, [viewportWidth]);

  useResizeEffect(
    dashboardContainerRef,
    ({ width }) => {
      setAvailableContainerSpace(getContainerWidth(width));

      if (window.innerWidth !== viewportWidth) {
        debounceSetViewportWidth(window.innerWidth);
      }
    },
    [setAvailableContainerSpace, viewportWidth, debounceSetViewportWidth]
  );

  return useMemo(
    () => ({
      pageSize: sizeFromWidth(
        STORY_PREVIEW_WIDTH[thumbnailMode ? VIEWPORT_BREAKPOINT.THUMBNAIL : bp],
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
