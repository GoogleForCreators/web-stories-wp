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
/**
 * Internal dependencies
 */
import { PAGE_RATIO } from '../constants';
import theme from '../theme';

const descendingBreakpointKeys = Object.keys(theme.breakpoint.raw).sort(
  (a, b) => theme.breakpoint.raw[b] - theme.breakpoint.raw[a]
);
const getCurrentBp = (availableContainerSpace) => {
  return descendingBreakpointKeys.reduce((current, bp) => {
    return availableContainerSpace <= theme.breakpoint.raw[bp] ? bp : current;
  }, descendingBreakpointKeys[0]);
};

// this will break the detail template view
const sizeFromWidth = (width, { respectSetWidth, availableContainerSpace }) => {
  if (respectSetWidth) {
    return { width, height: width / PAGE_RATIO };
  }

  const itemsInRow = Math.floor(availableContainerSpace / width);
  const columnGapWidth = 10 * itemsInRow;
  const takenSpace = width * itemsInRow + columnGapWidth;
  const remainingSpace = availableContainerSpace - takenSpace;
  const addToWidthValue = remainingSpace / itemsInRow;

  const trueWidth = width + addToWidthValue;
  return {
    width: trueWidth,
    height: trueWidth / PAGE_RATIO,
  };
};

const WP_LEFT_NAV_WIDTH = 38;
const DASHBOARD_LEFT_NAV_WIDTH = 190;

// NO MAGIC NUMBERS - set gutter by bp
const getTrueInnerWidth = (bp) => {
  const { innerWidth } = window;
  if (innerWidth >= 783 && innerWidth <= 1120) {
    return innerWidth - WP_LEFT_NAV_WIDTH;
  } else if (innerWidth >= 1120) {
    return innerWidth - WP_LEFT_NAV_WIDTH - DASHBOARD_LEFT_NAV_WIDTH - 40;
  } else {
    return innerWidth;
  }
};
export default function usePagePreviewSize(options = {}) {
  const { thumbnailMode = false, isGrid } = options;
  const [availableContainerSpace, setAvailableContainerSpace] = useState(
    getTrueInnerWidth()
  );

  const [bp, setBp] = useState(getCurrentBp(availableContainerSpace));

  useEffect(() => {
    if (thumbnailMode) {
      return () => {};
    }

    const handleResize = () => setAvailableContainerSpace(getTrueInnerWidth());

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [thumbnailMode, availableContainerSpace]);

  useEffect(() => {
    if (thumbnailMode) {
      return () => {};
    }
    return setBp(getCurrentBp(availableContainerSpace));
  }, [setBp, thumbnailMode, availableContainerSpace]);

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
