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
import { useMemo } from 'react';

/**
 * Internal dependencies
 */
import { themeHelpers } from '../../../design-system';
import {
  PAGE_WIDTH,
  PAGE_RATIO,
  FULLBLEED_RATIO,
  ZOOM_SETTING,
  PAGE_NAV_WIDTH,
  PAGE_WIDTH_FACTOR,
} from '../../constants';
import useReduction from '../../utils/useReduction';

// Beware, that these are slightly magic numbers, that just happens to look good
const ZOOM_PADDING_LARGE = 72;
const ZOOM_PADDING_NONE = 12;

const LEGACY_PAGE_WIDTHS = [412, 268, 223];

const INITIAL_STATE = {
  zoomSetting: ZOOM_SETTING.FIT,
  workspaceSize: {
    width: null,
    height: null,
  },
  scrollOffset: {
    left: 0,
    top: 0,
  },
};

const reducer = {
  setZoomSetting: (state, { payload }) => ({
    ...state,
    zoomSetting: payload,
    scrollOffset: {
      left: 0,
      top: 0,
    },
  }),
  setScrollOffset: (state, { payload }) => ({
    ...state,
    scrollOffset: payload,
  }),
  setWorkspaceSize: (state, { payload }) => ({
    ...state,
    workspaceSize: payload,
  }),
};

function calculateViewportProperties(
  hasCanvasZoom,
  workspaceSize,
  zoomSetting
) {
  if (!hasCanvasZoom) {
    // Use the old legacy method of calculating possible page size:
    const maxWidth = workspaceSize.width - PAGE_NAV_WIDTH * 2;
    const maxHeight = workspaceSize.height;

    const bestSize =
      LEGACY_PAGE_WIDTHS.find(
        (size) => size <= maxWidth && size / FULLBLEED_RATIO <= maxHeight
      ) || LEGACY_PAGE_WIDTHS[LEGACY_PAGE_WIDTHS.length - 1];

    return {
      pageWidth: bestSize,
      pageHeight: bestSize / PAGE_RATIO,
      hasHorizontalOverflow: false,
      hasVerticalOverflow: false,
      hasPageNavigation: true,
      pagePadding: ZOOM_PADDING_NONE,
      viewportWidth: bestSize + ZOOM_PADDING_NONE,
      viewportHeight: bestSize / FULLBLEED_RATIO + ZOOM_PADDING_NONE,
    };
  }
  // Calculate page size based on zoom setting
  let maxPageWidth;
  const workspaceRatio = workspaceSize.width / workspaceSize.height;
  switch (zoomSetting) {
    case ZOOM_SETTING.FILL: {
      // See how much we can fit inside so all space is used minus gap
      if (workspaceRatio > FULLBLEED_RATIO) {
        // workspace is limited in the height, so use the width minus room for scrollbar
        maxPageWidth =
          workspaceSize.width -
          themeHelpers.SCROLLBAR_WIDTH -
          ZOOM_PADDING_LARGE;
      } else {
        // workspace is limited in the width, so use the height minus room for scrollbar converted
        maxPageWidth =
          (workspaceSize.height - themeHelpers.SCROLLBAR_WIDTH) *
            FULLBLEED_RATIO -
          ZOOM_PADDING_LARGE;
      }
      break;
    }
    case ZOOM_SETTING.FIT: {
      // See how much we can fit inside so all is visible
      // However, leave some extra space, as we don't want it to hug too tightly to the edges.
      if (workspaceRatio > FULLBLEED_RATIO) {
        // workspace is limited in the height, so use the (height - padding) converted
        maxPageWidth =
          (workspaceSize.height - ZOOM_PADDING_LARGE) * FULLBLEED_RATIO;
      } else {
        // workspace is limited in the width, so use the width - padding
        maxPageWidth = workspaceSize.width - ZOOM_PADDING_LARGE;
      }
      break;
    }
    case ZOOM_SETTING.SINGLE: {
      maxPageWidth = PAGE_WIDTH;
      break;
    }
    case ZOOM_SETTING.DOUBLE: {
      maxPageWidth = 2 * PAGE_WIDTH;
      break;
    }
    default:
      break;
  }
  // Floor page width to nearest multiple of PAGE_WIDTH_FACTOR
  const pageWidth =
    PAGE_WIDTH_FACTOR * Math.floor(maxPageWidth / PAGE_WIDTH_FACTOR);
  // Update whether there's overflow and if we have room for page navigation
  const pageHeight = pageWidth / PAGE_RATIO;
  const fullbleedHeight = pageWidth / FULLBLEED_RATIO;
  // Is full width of available area minus gap used (up to two zoom factors off)
  const hasHorizontalOverflow =
    pageWidth >=
    workspaceSize.width - ZOOM_PADDING_LARGE - 2 * PAGE_WIDTH_FACTOR;
  // Is full height of available area minus gap used (up to two zoom factors off)
  const hasVerticalOverflow =
    pageHeight >=
    workspaceSize.height - ZOOM_PADDING_LARGE - 2 * PAGE_WIDTH_FACTOR;
  const hasAnyOverflow = hasHorizontalOverflow || hasVerticalOverflow;
  const hasPageNavigation =
    !hasAnyOverflow && pageWidth < workspaceSize.width - 2 * PAGE_NAV_WIDTH;
  // if any scroll, add a lage padding, else just a bit to allow to show hover frame
  const pagePadding = hasAnyOverflow ? ZOOM_PADDING_LARGE : ZOOM_PADDING_NONE;
  // If any kind of scroll, use entire available workspace
  const viewportWidth = hasAnyOverflow
    ? workspaceSize.width
    : pageWidth + pagePadding;
  const viewportHeight = hasAnyOverflow
    ? workspaceSize.height
    : fullbleedHeight + pagePadding;
  return {
    pageWidth,
    pageHeight,
    hasHorizontalOverflow,
    hasVerticalOverflow,
    hasPageNavigation,
    pagePadding,
    viewportWidth,
    viewportHeight,
  };
}

function useZoomSetting(hasCanvasZoom) {
  const [state, actions] = useReduction(INITIAL_STATE, reducer);
  const { zoomSetting, workspaceSize, scrollOffset } = state;

  const viewportProperties = useMemo(
    () =>
      calculateViewportProperties(hasCanvasZoom, workspaceSize, zoomSetting),
    [hasCanvasZoom, workspaceSize, zoomSetting]
  );

  return {
    state: {
      ...viewportProperties,
      zoomSetting,
      workspaceWidth: workspaceSize.width,
      workspaceHeight: workspaceSize.height,
      scrollLeft: scrollOffset.left,
      scrollTop: scrollOffset.top,
    },
    actions,
  };
}

export default useZoomSetting;
