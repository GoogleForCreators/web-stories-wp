/*
 * Copyright 2023 Google LLC
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
import type { Page, ElementId } from '@googleforcreators/elements';

export interface CarouselContext {
  state: {
    pageThumbWidth: number;
    pageThumbHeight: number;
    pageThumbMargin: number;
    carouselWidth: number;
    hasOverflow: boolean;
    pages: Page[];
    pageIds: ElementId[];
    numPages: number;
    currentPageId: ElementId | null;
    canScrollBack: boolean;
    canScrollForward: boolean;
    showSkeleton: boolean;
  };
  actions: {
    scrollBack: () => void;
    scrollForward: () => void;
    clickPage: (page: Page) => void;
    rearrangePages: unknown;
    setListRef: unknown;
    setPageRef: unknown;
  };
}
