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
import { PAGE_WIDTH, PAGE_RATIO, FULLBLEED_RATIO } from '@web-stories-wp/units';
import { themeHelpers } from '@web-stories-wp/design-system';
/**
 * Internal dependencies
 */
import {
  ZOOM_SETTING,
  PAGE_NAV_WIDTH,
  PAGE_WIDTH_FACTOR,
} from '../../constants';
import useReduction from '../../utils/useReduction';

// Beware, that these are slightly magic numbers, that just happens to look good
const ZOOM_PADDING_LARGE = 72;
const ZOOM_PADDING_NONE = 12;

const INITIAL_STATE = {
  zoomSetting: ZOOM_SETTING.FIT,
  zoomLevel: null,
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
    default:
      // If no predefined setting was found, check for the zoom level value.
      if (isNaN(zoomLevel)) {
        break;
      }
      maxPageWidth = zoomLevel * PAGE_WIDTH;
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
