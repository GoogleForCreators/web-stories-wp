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
import { noop } from '../../../../utils/noop';
import type { CarouselContext } from './types';

const Context = createContext<CarouselContext>({
  state: {
    pageThumbWidth: 0,
    pageThumbHeight: 0,
    pageThumbMargin: 0,
    carouselWidth: 0,
    hasOverflow: false,
    pages: [],
    pageIds: [],
    numPages: 0,
    currentPageId: null,
    canScrollBack: false,
    canScrollForward: false,
    showSkeleton: false,
  },
  actions: {
    scrollBack: noop,
    scrollForward: noop,
    clickPage: noop,
    rearrangePages: noop,
    setListRef: noop,
    setPageRef: noop,
  },
});

export default Context;
