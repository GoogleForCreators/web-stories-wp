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
import {
  BUTTON_GUTTER,
  MENU_GUTTER,
  WIDE_WORKSPACE_LIMIT,
  WIDE_THUMBNAIL_WIDTH,
  WIDE_THUMBNAIL_HEIGHT,
  NARROW_THUMBNAIL_WIDTH,
  NARROW_THUMBNAIL_HEIGHT,
  THUMBNAIL_MARGIN,
} from './constants';

function useCarouselSizing({ availableSpace, numPages }) {
  return useMemo(() => {
    const isWideWorkspace = availableSpace >= WIDE_WORKSPACE_LIMIT;
    const spaceForCarousel =
      availableSpace - 2 * MENU_GUTTER - 2 * BUTTON_GUTTER;
    const pageThumbWidth = isWideWorkspace
      ? WIDE_THUMBNAIL_WIDTH
      : NARROW_THUMBNAIL_WIDTH;
    const pageThumbHeight = isWideWorkspace
      ? WIDE_THUMBNAIL_HEIGHT
      : NARROW_THUMBNAIL_HEIGHT;
    const pageThumbMargin = THUMBNAIL_MARGIN;
    const pageAndMargin = pageThumbWidth + pageThumbMargin;
    const showablePages = Math.floor(
      (spaceForCarousel - pageThumbMargin) / pageAndMargin
    );
    const hasOverflow = showablePages < numPages;
    const carouselWidth =
      Math.min(showablePages, numPages) * (pageThumbWidth + pageThumbMargin) +
      pageThumbMargin;
    return {
      pageThumbWidth,
      pageThumbHeight,
      pageThumbMargin,
      carouselWidth,
      showablePages,
      hasOverflow,
    };
  }, [availableSpace, numPages]);
}

export default useCarouselSizing;
