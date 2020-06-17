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
import PropTypes from 'prop-types';
import { useMemo } from 'react';

/**
 * Internal dependencies
 */
import Context from './context';

import useLoadStory from './effects/useLoadStory';
import useSaveStory from './actions/useSaveStory';
import useHistoryEntry from './effects/useHistoryEntry';
import useHistoryReplay from './effects/useHistoryReplay';
import useStoryReducer from './useStoryReducer';
import useAutoSave from './actions/useAutoSave';

function StoryProvider({ storyId, children }) {
  const {
    state: reducerState,
    api,
    internal: { restore },
  } = useStoryReducer();
  const { pages, current, selection, story, capabilities } = reducerState;

  // Generate current page info.
  const {
    currentPageId,
    currentPageIndex,
    currentPageNumber,
    currentPage,
  } = useMemo(() => {
    if (!current) {
      return {
        currentPageId: null,
        currentPageIndex: null,
        currentPageNumber: null,
        currentPage: null,
      };
    }
    const index = pages.findIndex(({ id }) => id === current);
    const number = index + 1;
    const page = pages[index];
    return {
      currentPageId: current,
      currentPageIndex: index,
      currentPageNumber: number,
      currentPage: page,
    };
  }, [pages, current]);

  // Generate selection info
  const { selectedElementIds, selectedElements, hasSelection } = useMemo(() => {
    if (!currentPage) {
      return {
        selectedElements: [],
        selectedElementIds: [],
        hasSelection: false,
      };
    }
    const els = currentPage.elements.filter(({ id }) => selection.includes(id));
    return {
      selectedElementIds: selection,
      selectedElements: els,
      hasSelection: els.length > 0,
    };
  }, [currentPage, selection]);

  // This effect loads and initialises the story on first load (when there's no pages).
  const shouldLoad = pages.length === 0;
  useLoadStory({ restore, shouldLoad, storyId });

  // These effects send updates to and restores state from history.
  useHistoryEntry({ pages, current, selection, story, capabilities });
  useHistoryReplay({ restore });

  // This action allows the user to save the story
  // (and it will have side-effects because saving can update url and status,
  //  thus the need for `updateStory`)
  const { updateStory } = api;
  const { saveStory, isSaving, isFreshlyPublished } = useSaveStory({
    storyId,
    pages,
    story,
    updateStory,
  });

  const { autoSave, isAutoSaving } = useAutoSave({
    storyId,
    pages,
    story,
  });

  const state = {
    state: {
      pages,
      currentPageId,
      currentPageIndex,
      currentPageNumber,
      currentPage,
      selectedElementIds,
      selectedElements,
      hasSelection,
      story,
      capabilities,
      meta: {
        isSaving: isSaving || isAutoSaving,
        isFreshlyPublished,
      },
    },
    actions: {
      ...api,
      autoSave,
      saveStory,
    },
    internal: { reducerState, restore },
  };

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

StoryProvider.propTypes = {
  children: PropTypes.node,
  storyId: PropTypes.number,
};

export default StoryProvider;
