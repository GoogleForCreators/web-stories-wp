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
import type { PropsWithChildren } from 'react';
import { useMemo, useEffect } from '@googleforcreators/react';
import type { Page } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { STABLE_ARRAY } from '../../constants';
import type { RawStory } from '../../types';
import Context from './context';

import useLoadStory from './effects/useLoadStory';
import useSaveStory from './actions/useSaveStory';
import useHashState from './effects/useHashState';
import useHistoryEntry from './effects/useHistoryEntry';
import useHistoryReplay from './effects/useHistoryReplay';
import useStoryReducer from './useStoryReducer';
import useAutoSave from './actions/useAutoSave';
import { StoryTriggersProvider } from './storyTriggers';
import useLocalAutoSave from './actions/useLocalAutoSave';

interface ProviderProps {
  storyId: number;
  initialEdits?: {
    story?: RawStory;
  };
}
function StoryProvider({
  storyId,
  initialEdits,
  children,
}: PropsWithChildren<ProviderProps>) {
  const [hashPageId, setHashPageId] = useHashState('page', null);
  const {
    state: reducerState,
    api,
    internal: { restore },
  } = useStoryReducer({
    current: hashPageId,
  });
  const {
    pages,
    current,
    selection,
    story,
    animationState,
    capabilities,
    copiedElementState,
  } = reducerState;

  useEffect(() => setHashPageId(current), [current, setHashPageId]);

  // Generate current page info.
  let currentPageId: string | null = null;
  let currentPageIndex: number | null = null;
  let currentPageNumber: number | null = null;
  let currentPage: Page | null = null;
  if (current) {
    currentPageId = current;
    currentPageIndex = pages.findIndex(({ id }) => id === current);
    currentPageNumber = currentPageIndex + 1;
    currentPage = pages[currentPageIndex];
  }

  // Generate selection info
  const selectedElementIds = useMemo(
    () => (selection && selection.length > 0 ? selection : STABLE_ARRAY),
    [selection]
  );
  const isCurrentPageEmpty = !currentPage;

  const currentPageElements = currentPage?.elements;
  const selectedElements = useMemo(() => {
    if (isCurrentPageEmpty) {
      return STABLE_ARRAY;
    }
    const els = currentPageElements?.filter(
      ({ id }) => selection && selection.includes(id)
    );
    return els && els.length > 0 ? els : STABLE_ARRAY;
  }, [isCurrentPageEmpty, currentPageElements, selection]);

  const currentPageAnimations = currentPage?.animations;
  const selectedElementAnimations = useMemo(() => {
    if (isCurrentPageEmpty || selection.length === 0) {
      return STABLE_ARRAY;
    }
    const animations = (currentPageAnimations || []).filter(({ targets }) =>
      targets.some((id) => selection && selection.includes(id))
    );
    return animations.length > 0 ? animations : STABLE_ARRAY;
  }, [isCurrentPageEmpty, selection, currentPageAnimations]);
  const hasSelection = selectedElements.length > 0;

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
  const { saveStory, isSaving, isFreshlyPublished, isFreshlyPending } =
    useSaveStory({
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

  const { restoreLocalAutoSave } = useLocalAutoSave({
    pages,
    capabilities,
    restore,
    storyId,
    isNew: story.status === 'auto-draft',
  });

  const fullStory = useMemo(
    () => ({
      pages,
      currentPage,
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
        isFreshlyPending,
      },
      copiedElementState,
    }),
    [
      pages,
      currentPage,
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
      isFreshlyPending,
      copiedElementState,
    ]
  );

  const state = {
    state: fullStory,
    actions: {
      ...api,
      autoSave,
      saveStory,
      restoreLocalAutoSave,
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

export default StoryProvider;
