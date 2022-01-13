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
import { useMemo, useEffect } from '@web-stories-wp/react';

/**
 * Internal dependencies
 */
import Context from './context';

import useLoadStory from './effects/useLoadStory';
import useSaveStory from './actions/useSaveStory';
import useHashState from './effects/useHashState';
import useHistoryEntry from './effects/useHistoryEntry';
import useHistoryReplay from './effects/useHistoryReplay';
import useStoryReducer from './useStoryReducer';
import useAutoSave from './actions/useAutoSave';
import { StoryTriggersProvider } from './storyTriggers';

/**
 * Shared reference to an empty array for cases where it is important to avoid
 * returning a new array reference on every invocation, as in a connected or
 * other pure component which performs `shouldComponentUpdate` check on props.
 */
const EMPTY_ARRAY = [];

function StoryProvider({ storyId, initialEdits, children }) {
  const [hashPageId, setHashPageId] = useHashState('page', null);
  const {
    state: reducerState,
    api,
    internal: { restore },
  } = useStoryReducer({
    current: hashPageId,
  });
  const { pages, current, selection, story, animationState, capabilities } =
    reducerState;

  useEffect(() => setHashPageId(current), [current, setHashPageId]);

  // Generate current page info.
  const {
    currentPageId,
    currentPageIndex,
    currentPageNumber,
    currentPage,
    currentPageHash,
  } = useMemo(() => {
    if (!current) {
      return {
        currentPageId: null,
        currentPageIndex: null,
        currentPageNumber: null,
        currentPage: null,
        currentPageHash: null,
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
      currentPageHash: JSON.stringify(page),
    };
  }, [pages, current]);

  // Generate selection info
  const {
    selectedElementIds,
    selectedElements,
    selectedElementAnimations,
    hasSelection,
  } = useMemo(() => {
    if (!currentPage) {
      return {
        selectedElements: EMPTY_ARRAY,
        selectedElementIds: EMPTY_ARRAY,
        selectedElementAnimations: EMPTY_ARRAY,
        hasSelection: false,
      };
    }

    const els = currentPage.elements.filter(({ id }) => selection.includes(id));
    const animations = (currentPage.animations || []).reduce(
      (acc, { targets, ...properties }) => {
        if (targets.some((id) => selection.includes(id))) {
          return [...acc, { targets, ...properties }];
        }

        return acc;
      },
      []
    );

    return {
      selectedElementIds: selection.length > 0 ? selection : EMPTY_ARRAY,
      selectedElements: els.length > 0 ? els : EMPTY_ARRAY,
      selectedElementAnimations:
        animations.length > 0 ? animations : EMPTY_ARRAY,
      hasSelection: els.length > 0,
    };
  }, [currentPage, selection]);

  // This effect loads and initialises the story on first load (when there's no pages).
  const shouldLoad = pages.length === 0;
  useLoadStory({ restore, shouldLoad, storyId, story: initialEdits?.story });

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

  const fullStory = useMemo(
    () => ({
      pages,
      currentPage,
      currentPageHash,
      currentPageId,
      currentPageIndex,
      currentPageNumber,
      selectedElementIds,
      selectedElements,
      selectedElementAnimations,
      hasSelection,
      story,
      animationState,
      capabilities,
      meta: {
        isSaving: isSaving || isAutoSaving,
        isSavingStory: isSaving,
        isAutoSavingStory: isAutoSaving,
        isFreshlyPublished,
      },
    }),
    [
      pages,
      currentPage,
      currentPageHash,
      currentPageId,
      currentPageIndex,
      currentPageNumber,
      selectedElementIds,
      selectedElements,
      selectedElementAnimations,
      hasSelection,
      story,
      animationState,
      capabilities,
      isSaving,
      isAutoSaving,
      isFreshlyPublished,
    ]
  );

  const state = {
    state: fullStory,
    actions: {
      ...api,
      autoSave,
      saveStory,
    },
    internal: { reducerState, restore },
  };

  return (
    <Context.Provider value={state}>
      <StoryTriggersProvider story={fullStory}>
        {children}
      </StoryTriggersProvider>
    </Context.Provider>
  );
}

StoryProvider.propTypes = {
  children: PropTypes.node,
  storyId: PropTypes.number,
  initialEdits: PropTypes.object,
};

export default StoryProvider;
