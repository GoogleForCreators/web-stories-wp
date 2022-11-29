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
import type { Element, Page, Story } from '@googleforcreators/elements';
import type { StoryAnimation } from '@googleforcreators/animation';

/**
 * Internal dependencies
 */
import type { StoryProviderState } from '../../types';
import { INITIAL_STATE } from './useStoryReducer/useStoryReducer';

export default createContext<StoryProviderState>({
  state: {
    story: {} as Story,
    pages: [] as Page[],
    animationState: '',
    capabilities: {},
    currentPage: null,
    currentPageId: null,
    currentPageIndex: null,
    currentPageNumber: null,
    selectedElementIds: [],
    selectedElements: [] as Element[],
    selectedElementAnimations: [] as StoryAnimation[],
    hasSelection: false,
    meta: {
      isSaving: false,
      isSavingStory: false,
      isAutoSavingStory: false,
      isFreshlyPublished: false,
      isFreshlyPending: false,
    },
  },
  actions: {
    addPage: () => INITIAL_STATE,
    addPageAt: () => INITIAL_STATE,
    copySelectedElement: () => INITIAL_STATE,
    deletePage: () => INITIAL_STATE,
    deleteCurrentPage: () => INITIAL_STATE,
    updatePageProperties: () => INITIAL_STATE,
    updateCurrentPageProperties: () => INITIAL_STATE,
    arrangePage: () => INITIAL_STATE,
    setCurrentPage: () => INITIAL_STATE,
    addElements: () => INITIAL_STATE,
    addElement: () => INITIAL_STATE,
    deleteElementsById: () => INITIAL_STATE,
    deleteElementById: () => INITIAL_STATE,
    deleteSelectedElements: () => INITIAL_STATE,
    updateElementsById: () => INITIAL_STATE,
    updateElementsByResourceId: () => INITIAL_STATE,
    deleteElementsByResourceId: () => INITIAL_STATE,
    updateElementById: () => INITIAL_STATE,
    duplicateElementsById: () => INITIAL_STATE,
    updateSelectedElements: () => INITIAL_STATE,
    combineElements: () => INITIAL_STATE,
    setBackgroundElement: () => INITIAL_STATE,
    clearBackgroundElement: () => INITIAL_STATE,
    arrangeElement: () => INITIAL_STATE,
    arrangeGroup: () => INITIAL_STATE,
    arrangeSelection: () => INITIAL_STATE,
    setSelectedElementsById: () => INITIAL_STATE,
    clearSelection: () => INITIAL_STATE,
    addElementToSelection: () => INITIAL_STATE,
    removeElementFromSelection: () => INITIAL_STATE,
    toggleElementInSelection: () => INITIAL_STATE,
    updateAnimationState: () => INITIAL_STATE,
    addAnimations: () => INITIAL_STATE,
    updateStory: () => INITIAL_STATE,
    toggleLayer: () => INITIAL_STATE,
    updateElementsByFontFamily: () => INITIAL_STATE,
    addGroup: () => INITIAL_STATE,
    updateGroupById: () => INITIAL_STATE,
    deleteGroupById: () => INITIAL_STATE,
    deleteGroupAndElementsById: () => INITIAL_STATE,
    duplicateGroupById: () => INITIAL_STATE,
    removeElementFromGroup: () => INITIAL_STATE,
    addElementsAcrossPages: () => INITIAL_STATE,
    autoSave: () => null,
    saveStory: () => null,
    restoreLocalAutoSave: () => null,
  },
  internal: {
    reducerState: INITIAL_STATE,
    restore: () => INITIAL_STATE,
  },
});
