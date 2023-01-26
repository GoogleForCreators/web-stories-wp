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
import { createContext } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import type { LayoutProviderState } from '../../types';
import { CarouselState, ZoomSetting } from '../../constants';
import { noop } from '../../utils/noop';

export default createContext<LayoutProviderState>({
  actions: {
    setZoomSetting: noop,
    closeCarousel: noop,
    openCarousel: noop,
    setScrollOffset: noop,
    setZoomLevel: noop,
  },
  state: {
    pageWidth: 0,
    pageHeight: 0,
    hasHorizontalOverflow: false,
    hasVerticalOverflow: false,
    hasPageNavigation: false,
    pagePadding: 0,
    viewportWidth: 0,
    viewportHeight: 0,
    hasExtraPages: false,
    extraPageWidth: 0,
    extraPageCount: 0,
    zoomSetting: ZoomSetting.Fit,
    zoomLevel: 0,
    workspaceWidth: 0,
    workspaceHeight: 0,
    scrollLeft: 0,
    scrollTop: 0,
    carouselState: CarouselState.Open,
    isCarouselInTransition: false,
  },
});
