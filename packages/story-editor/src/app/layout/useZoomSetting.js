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
import { useMemo, useReduction } from '@googleforcreators/react';
import {
  PAGE_WIDTH,
  PAGE_RATIO,
  FULLBLEED_RATIO,
} from '@googleforcreators/units';
import { themeHelpers } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import {
  ZOOM_SETTING,
  PAGE_NAV_WIDTH,
  PAGE_WIDTH_FACTOR,
} from '../../constants';

// Beware, that these are slightly magic numbers, that just happens to look good
const ZOOM_PADDING_LARGE = 72;
const ZOOM_PADDING_NONE = 12;

// This one is only used for Zoom=FIT when width is the limiting factor
// there must be room for the page menu with 16px gap on either side
// - times both sides of the canvas = 2 * (40 + 2 * 16)
const ZOOM_PADDING_FIT = 144;

const INITIAL_STATE = {
  zoomSetting: ZOOM_SETTING.FIT,
  zoomLevel: null,
  workspaceSize: {
    width: null,
    height: null,
    availableHeight: null,
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
  setZoomLevel: (state, { payload }) => ({
    ...state,
    zoomLevel: payload,
    zoomSetting: ZOOM_SETTING.FIXED,
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

function calculateViewportProperties(workspaceSize, zoomSetting, zoomLevel) {
  // Calculate page size based on zoom setting
  let maxPageWidth;
  const workspaceRatio = workspaceSize.width / workspaceSize.availableHeight;
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
          (workspaceSize.availableHeight - themeHelpers.SCROLLBAR_WIDTH) *
            FULLBLEED_RATIO -
          ZOOM_PADDING_LARGE;
      }
      break;
    }
    case ZOOM_SETTING.FIT: {
      // See how much we can fit inside so all is visible
      // However, leave some extra space, as we don't want it to hug too tightly to the edges.
      const maxWidth = workspaceSize.width - ZOOM_PADDING_FIT;
      if (workspaceRatio > FULLBLEED_RATIO) {
        // workspace is limited in the height, so use the (height - padding) converted
        // However, it can never be wider than the max width calculated above
        maxPageWidth = Math.min(
          maxWidth,
          (workspaceSize.availableHeight - ZOOM_PADDING_LARGE) * FULLBLEED_RATIO
        );
      } else {
        // workspace is limited in the width, so use the width - padding
        maxPageWidth = maxWidth;
      }
      break;
    }
    default:
      // If no predefined setting was found, check for the zoom level value.
      if (isNaN(zoomLevel)) {
        break;
      }
      maxPageWidth = zoomLevel * PAGE_WIDTH;
      break;
  }

  // Since workspaceSize.width & workspaceSize.height are initially null,
  // maxPageWidth can end up being negative.
  // Set it to 0 in that case.
  maxPageWidth = Math.max(0, maxPageWidth);

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
    workspaceSize.availableHeight - ZOOM_PADDING_LARGE - 2 * PAGE_WIDTH_FACTOR;
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
    ? workspaceSize.availableHeight
    : fullbleedHeight + pagePadding;

  // Calculate if extra pages can be seen before/after current page and if so how many
  const extraSpace =
    (workspaceSize.width - (pageWidth + 2 * PAGE_NAV_WIDTH)) / 2;
  const extraPageWidth = Math.round(0.9 * pageWidth);
  const hasExtraPages = !hasAnyOverflow && hasPageNavigation && extraSpace > 50;
  const extraPageCount = hasExtraPages
    ? Math.ceil(extraSpace / extraPageWidth)
    : 0;
  return {
    pageWidth,
    pageHeight,
    hasHorizontalOverflow,
    hasVerticalOverflow,
    hasPageNavigation,
    pagePadding,
    viewportWidth,
    viewportHeight,
    hasExtraPages,
    extraPageWidth,
    extraPageCount,
  };
}

function useZoomSetting() {
  const [state, actions] = useReduction(INITIAL_STATE, reducer);
  const {
    zoomSetting,
    zoomLevel: _zoomLevel,
    workspaceSize,
    scrollOffset,
  } = state;

  const viewportProperties = useMemo(
    () => calculateViewportProperties(workspaceSize, zoomSetting, _zoomLevel),
    [workspaceSize, zoomSetting, _zoomLevel]
  );

  const { pageWidth } = viewportProperties;

  const zoomLevel = useMemo(() => {
    const maxPageWidth = Math.ceil(
      (pageWidth / PAGE_WIDTH_FACTOR) * PAGE_WIDTH_FACTOR
    );
    switch (zoomSetting) {
      case ZOOM_SETTING.FILL:
      case ZOOM_SETTING.FIT:
        return maxPageWidth / PAGE_WIDTH;
      default:
        return _zoomLevel;
    }
  }, [_zoomLevel, pageWidth, zoomSetting]);

  return {
    state: {
      ...viewportProperties,
      zoomSetting,
      zoomLevel,
      workspaceWidth: workspaceSize.width,
      workspaceHeight: workspaceSize.height,
      scrollLeft: scrollOffset.left,
      scrollTop: scrollOffset.top,
    },
    actions,
  };
}

export default useZoomSetting;
