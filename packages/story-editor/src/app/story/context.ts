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
import type { Animation, Element, Page } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import type { StoryProviderState } from '../../types/storyProvider';

export default createContext<StoryProviderState>({
  state: {
    story: null,
    pages: [] as Page[],
    animationState: '',
    capabilities: {},
    currentPage: null,
    currentPageId: null,
    currentPageIndex: null,
    currentPageNumber: null,
    selectedElementIds: [],
    selectedElements: [] as Element[],
    selectedElementAnimations: [] as Animation[],
    hasSelection: false,
    meta: {
      isSaving: false,
      isSavingStory: false,
      isAutoSavingStory: false,
      isFreshlyPublished: false,
      isFreshlyPending: false,
    },
  },
  actions: {},
});
