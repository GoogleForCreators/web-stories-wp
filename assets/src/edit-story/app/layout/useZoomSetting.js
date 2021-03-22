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
import { useMemo, useState } from 'react';

/**
 * Internal dependencies
 */
import {
  PAGE_WIDTH,
  PAGE_RATIO,
  FULLBLEED_RATIO,
  ZOOM_SETTING,
  PAGE_NAV_WIDTH,
  SCROLLBAR_WIDTH,
  PAGE_WIDTH_FACTOR,
} from '../../constants';

function useZoomSetting() {
  // TODO store in localSettings?
  const [zoomSetting, setZoomSetting] = useState(ZOOM_SETTING.FIT);
  const [workspaceSize, setWorkspaceSize] = useState({
    width: null,
    height: null,
  });

  const state = useMemo(() => {
    // Calculate page size based on zoom setting
    let maxPageWidth;
    const workspaceRatio = workspaceSize.width / workspaceSize.height;
    switch (zoomSetting) {
      case ZOOM_SETTING.FILL: {
        // See how much we can fit inside so all space is used
        if (workspaceRatio > FULLBLEED_RATIO) {
          // workspace is limited in the height, so use the width minus room for scrollbar
          maxPageWidth = workspaceSize.width - SCROLLBAR_WIDTH;
        } else {
          // workspace is limited in the width, so use the height minus room for scrollbar converted
          maxPageWidth =
            (workspaceSize.height - SCROLLBAR_WIDTH) * FULLBLEED_RATIO;
        }
        break;
      }
      case ZOOM_SETTING.FIT: {
        // See how much we can fit inside so all is visible
        // However, leave some extra space, as we don't want it to hug too tightly to the edges.
        // Beware, that these are slightly magic numbers, that just happens to look good
        const horizontalPaddingForFit = 72;
        const verticalPaddingForFit = 36;
        if (workspaceRatio > FULLBLEED_RATIO) {
          // workspace is limited in the height, so use the (height - padding) converted
          maxPageWidth =
            (workspaceSize.height - verticalPaddingForFit) * FULLBLEED_RATIO;
        } else {
          // workspace is limited in the width, so use the width - padding
          maxPageWidth = workspaceSize.width - horizontalPaddingForFit;
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
      case ZOOM_SETTING.TRIPLE: {
        maxPageWidth = 3 * PAGE_WIDTH;
        break;
      }
      default:
        // do nothing for any of the fixed settings
        break;
    }
    // Floor page width to nearest multiple of PAGE_WIDTH_FACTOR
    const pageWidth =
      PAGE_WIDTH_FACTOR * Math.floor(maxPageWidth / PAGE_WIDTH_FACTOR);
    // Update whether there's overflow and if we have room for page navigation
    const pageHeight = pageWidth / PAGE_RATIO;
    const fullbleedHeight = pageWidth / FULLBLEED_RATIO;
    const hasHorizontalOverflow = pageWidth > workspaceSize.width;
    const hasVerticalOverflow = fullbleedHeight > workspaceSize.height;
    const hasPageNavigation =
      pageWidth < workspaceSize.width - 2 * PAGE_NAV_WIDTH;
    return {
      zoomSetting,
      pageWidth,
      pageHeight,
      hasHorizontalOverflow,
      hasVerticalOverflow,
      hasPageNavigation,
      workspaceWidth: workspaceSize.width,
      workspaceHeight: workspaceSize.height,
    };
  }, [workspaceSize, zoomSetting]);

  return {
    state,
    actions: {
      setZoomSetting,
      setWorkspaceSize,
    },
  };
}

export default useZoomSetting;
