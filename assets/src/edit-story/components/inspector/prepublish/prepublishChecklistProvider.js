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
import { useCallback, useState, useEffect, useMemo, useReducer } from 'react';
import PropTypes from 'prop-types';
/**
 * Internal dependencies
 */
import { useStory, useStoryTriggerListener, STORY_EVENTS } from '../../../app';
import { getPrepublishErrors } from '../../../app/prepublish';
import usePrevious from '../../../../design-system/utils/usePrevious';
import { useLayout } from '../../../app/layout';
import { PRE_PUBLISH_MESSAGE_TYPES } from '../../../app/prepublish/constants';
import Context from './context';
import {
  checkpointReducer,
  PPC_CHECKPOINT_STATE,
  PPC_CHECKPOINT_ACTION,
} from './prepublishCheckpointState';

const types = [
  PRE_PUBLISH_MESSAGE_TYPES.GUIDANCE,
  PRE_PUBLISH_MESSAGE_TYPES.ERROR,
  PRE_PUBLISH_MESSAGE_TYPES.WARNING,
];

function PrepublishChecklistProvider({ children }) {
  const [checkpointState, dispatch] = useReducer(
    checkpointReducer,
    PPC_CHECKPOINT_STATE.UNAVAILABLE
  );
  const pageSize = useLayout(({ state: { pageWidth, pageHeight } }) => ({
    width: pageWidth,
    height: pageHeight,
  }));

  const story = useStory(({ state: { story, pages } }) => {
    return { ...story, pages };
  });

  const isStoryLoaded = story?.pages.length > 0;
  const isChecklistEmpty = checkpointState === PPC_CHECKPOINT_STATE.NO_ISSUES;

  const [currentList, setCurrentList] = useState([]);
  const [isChecklistReviewRequested, setIsChecklistReviewRequested] = useState(
    false
  );

  const handleRefreshList = useCallback(async () => {
    const pagesWithSize = story.pages.map((page) => ({
      ...page,
      pageSize,
    }));

    setCurrentList(
      await getPrepublishErrors({ ...story, pages: pagesWithSize }, { types })
    );
  }, [story, pageSize]);

  const prevPages = usePrevious(story.pages);
  const prevPageSize = usePrevious(pageSize);

  const refreshOnInitialLoad = prevPages?.length === 0 && story.pages?.length;
  const refreshOnPageSizeChange = prevPageSize?.width !== pageSize?.width;

  const highPriorityLength = useMemo(
    () =>
      isStoryLoaded &&
      currentList.filter(
        (current) => current.type === PRE_PUBLISH_MESSAGE_TYPES.ERROR
      ).length,
    [currentList, isStoryLoaded]
  );

  const recommendedLength = useMemo(
    () =>
      isStoryLoaded &&
      currentList.filter((current) =>
        current.type.indexOf([
          PRE_PUBLISH_MESSAGE_TYPES.GUIDANCE,
          PRE_PUBLISH_MESSAGE_TYPES.WARNING,
        ])
      ).length,
    [currentList, isStoryLoaded]
  );

  // Review dialog should be seen when there are high priority items and first publish still hasn't happened.
  const shouldReviewDialogBeSeen =
    highPriorityLength > 0 && !isChecklistReviewRequested;

  useEffect(() => {
    if (refreshOnInitialLoad || refreshOnPageSizeChange) {
      handleRefreshList();
    }
  }, [handleRefreshList, refreshOnInitialLoad, refreshOnPageSizeChange]);

  useEffect(() => {
    if (story.status === 'publish') {
      dispatch(PPC_CHECKPOINT_ACTION.ON_STORY_IS_PUBLISHED);
    }
  }, [story]);

  useEffect(() => {
    if (
      checkpointState === PPC_CHECKPOINT_STATE.ALL &&
      highPriorityLength === 0 &&
      recommendedLength === 0 &&
      isStoryLoaded
    ) {
      dispatch(PPC_CHECKPOINT_ACTION.ON_ALL_ISSUES_CLEARED);
    }
  }, [checkpointState, isStoryLoaded, highPriorityLength, recommendedLength]);

  useEffect(() => {
    if (checkpointState === PPC_CHECKPOINT_STATE.NO_ISSUES) {
      if (highPriorityLength > 0 || recommendedLength > 0) {
        dispatch(PPC_CHECKPOINT_ACTION.ON_STORY_HAS_ISSUES);
      }
    }
  }, [checkpointState, highPriorityLength, recommendedLength]);

  useStoryTriggerListener(
    STORY_EVENTS.onSecondPageAdded,
    useCallback(() => {
      dispatch(PPC_CHECKPOINT_ACTION.ON_STORY_HAS_2_PAGES);
    }, [])
  );

  useStoryTriggerListener(
    STORY_EVENTS.onFifthPageAdded,
    useCallback(() => {
      dispatch(PPC_CHECKPOINT_ACTION.ON_STORY_HAS_5_PAGES);
    }, [])
  );

  useStoryTriggerListener(
    STORY_EVENTS.onInitialElementAdded,
    useCallback(() => {
      dispatch(PPC_CHECKPOINT_ACTION.ON_INITIAL_ELEMENT_ADDED);
    }, [])
  );

  const focusChecklistTab = useCallback(() => {
    dispatch(PPC_CHECKPOINT_ACTION.ON_PUBLISH_CLICKED);
    setIsChecklistReviewRequested(true);
  }, [setIsChecklistReviewRequested]);

  // Use this when a published story gets turned back to a draft.
  const resetReviewDialogTrigger = useCallback(() => {
    setIsChecklistReviewRequested(false);
  }, []);

  return (
    <Context.Provider
      value={{
        checklist: currentList,
        refreshChecklist: handleRefreshList,
        currentCheckpoint: checkpointState,
        isChecklistReviewRequested,
        focusChecklistTab,
        resetReviewDialogTrigger,
        shouldReviewDialogBeSeen,
        isChecklistEmpty,
      }}
    >
      {children}
    </Context.Provider>
  );
}

PrepublishChecklistProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrepublishChecklistProvider;
