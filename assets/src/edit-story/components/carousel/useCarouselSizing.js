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

function useCarouselSizing({ availableSpace, numPages }) {
  return useMemo(() => {
    const isWideWorkspace = availableSpace >= 700;
    const spaceForCarousel = availableSpace - 2 * 167 - 2 * 32;
    const pageThumbWidth = isWideWorkspace ? 40 : 36;
    const pageThumbHeight = isWideWorkspace ? 72 : 64;
    const pageThumbMargin = 16;
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
      hasOverflow,
    };
  }, [availableSpace, numPages]);
}

export default useCarouselSizing;
