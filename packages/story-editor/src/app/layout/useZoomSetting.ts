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
  ZoomSetting,
  PAGE_NAV_WIDTH,
  PAGE_WIDTH_FACTOR,
  MAX_EXTRA_PAGES,
} from '../../constants';

// Beware, that these are slightly magic numbers, that just happens to look good
const ZOOM_PADDING_LARGE = 72;
const ZOOM_PADDING_NONE = 12;

// This one is only used for Zoom=FIT when width is the limiting factor
// there must be room for the page menu with 16px gap on either side
// - times both sides of the canvas = 2 * (40 + 2 * 16)
const ZOOM_PADDING_FIT = 144;

const INITIAL_STATE = {
  zoomSetting: ZoomSetting.Fit,
  zoomLevel: 0,
  workspaceSize: {
    width: 0,
    height: 0,
    availableHeight: 0,
  },
  scrollOffset: {
    left: 0,
    top: 0,
  },
};

interface WorkspaceSize {
  width: number;
  height: number;
  availableHeight: number;
}
interface ScrollOffset {
  left: number;
  top: number;
}
interface ReducerState {
  zoomSetting: ZoomSetting;
  zoomLevel: number;
  workspaceSize: WorkspaceSize;
  scrollOffset: ScrollOffset;
}
interface SetZoomSettingProps {
  payload: ZoomSetting;
}
interface SetZoomLevelProps {
  payload: number;
}
interface SetScrollOffsetProps {
  payload: ScrollOffset;
}
interface SetWorkspaceSizeProps {
  payload: WorkspaceSize;
}
const reducer = {
  setZoomSetting: (state: ReducerState, { payload }: SetZoomSettingProps): ReducerState => ({
    ...state,
    zoomSetting: payload,
    scrollOffset: {
      left: 0,
      top: 0,
    },
  }),
  setZoomLevel: (state: ReducerState, { payload }: SetZoomLevelProps): ReducerState => ({
    ...state,
    zoomLevel: payload,
    zoomSetting: ZoomSetting.Fixed,
  }),
  setScrollOffset: (state: ReducerState, { payload }: SetScrollOffsetProps): ReducerState => ({
    ...state,
    scrollOffset: payload,
  }),
  setWorkspaceSize: (state: ReducerState, { payload }: SetWorkspaceSizeProps): ReducerState => ({
    ...state,
    workspaceSize: payload,
  }),
};

function calculateViewportProperties(workspaceSize: WorkspaceSize, zoomSetting: string, zoomLevel: number) {
  // Calculate page size based on zoom setting
  let maxPageWidth = 0;
  const workspaceRatio = workspaceSize.width / workspaceSize.availableHeight;
  switch (zoomSetting) {
    case ZoomSetting.Fill: {
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
    case ZoomSetting.Fit: {
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
    ? Math.min(MAX_EXTRA_PAGES, Math.ceil(extraSpace / extraPageWidth))
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
      case ZoomSetting.Fill:
      case ZoomSetting.Fit:
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
