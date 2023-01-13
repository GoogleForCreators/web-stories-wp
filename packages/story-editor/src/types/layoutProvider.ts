/*
 * Copyright 2022 Google LLC
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
 * Internal dependencies
 */
import type { CarouselState, ZoomSetting } from '../constants';

interface ScrollOffset {
  left: number;
  top: number;
}
export interface LayoutProviderState {
  state: {
    pageWidth: number;
    pageHeight: number;
    hasHorizontalOverflow: boolean;
    hasVerticalOverflow: boolean;
    hasPageNavigation: boolean;
    pagePadding: number;
    viewportWidth: number;
    viewportHeight: number;
    hasExtraPages: boolean;
    extraPageWidth: number;
    extraPageCount: number;
    zoomSetting: ZoomSetting;
    zoomLevel: number;
    workspaceWidth: number;
    workspaceHeight: number;
    scrollLeft: number;
    scrollTop: number;
    carouselState: CarouselState;
    isCarouselInTransition: boolean;
  };
  actions: {
    closeCarousel: () => void;
    openCarousel: () => void;
    setScrollOffset: (payload?: ScrollOffset) => void;
    setZoomLevel: (prevState: number) => void;
    setZoomSetting: (prevState: ZoomSetting) => void;
  };
}
