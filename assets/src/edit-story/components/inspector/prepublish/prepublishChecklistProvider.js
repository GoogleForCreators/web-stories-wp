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

  const [currentList, setCurrentList] = useState([]);
  const [isChecklistReviewTriggered, setIsChecklistReviewTriggered] = useState(
    false
  );
  const [isHighPriorityEmpty, setIsHighPriorityEmpty] = useState(false);

  const handleRefreshList = useCallback(async () => {
    const pagesWithSize = story.pages.map((page) => ({
      ...page,
      pageSize,
    }));

    // discern PPC types of messages based on checkpointState
    let types;
    switch (checkpointState) {
      case PPC_CHECKPOINT_STATE.UNAVAILABLE:
        types = [];
        break;
      default:
        types = [
          PRE_PUBLISH_MESSAGE_TYPES.GUIDANCE,
          PRE_PUBLISH_MESSAGE_TYPES.ERROR,
          PRE_PUBLISH_MESSAGE_TYPES.WARNING,
        ];
        break;
    }

    setCurrentList(
      await getPrepublishErrors({ ...story, pages: pagesWithSize }, { types })
    );
  }, [story, pageSize, checkpointState]);

  const prevPages = usePrevious(story.pages);
  const prevPageSize = usePrevious(pageSize);

  const refreshOnInitialLoad = prevPages?.length === 0 && story.pages?.length;
  const refreshOnPageSizeChange = prevPageSize?.width !== pageSize?.width;

  useEffect(() => {
    if (refreshOnInitialLoad || refreshOnPageSizeChange) {
      handleRefreshList();
    }
  }, [handleRefreshList, refreshOnInitialLoad, refreshOnPageSizeChange]);

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

  const highPriorityLength = useMemo(
    () =>
      currentList.filter(
        (current) => current.type === PRE_PUBLISH_MESSAGE_TYPES.ERROR
      ).length,
    [currentList]
  );

  // this will prevent the review dialog from getting triggered again
  useEffect(() => {
    if (
      checkpointState === PPC_CHECKPOINT_STATE.ALL &&
      highPriorityLength === 0
    ) {
      setIsHighPriorityEmpty(true);
    }
  }, [checkpointState, highPriorityLength]);

  const focusChecklistTab = useCallback(() => {
    dispatch(PPC_CHECKPOINT_ACTION.ON_PUBLISH_CLICKED);
    setIsChecklistReviewTriggered(true);
  }, [setIsChecklistReviewTriggered]);

  // Use this when a published story gets turned back to a draft.
  const resetReviewDialogTrigger = useCallback(() => {
    setIsChecklistReviewTriggered(false);
  }, []);

  // Review dialog should be seen when there are high priority items and first publish still hasn't happened.
  const shouldReviewDialogBeSeen = useMemo(
    () => !isHighPriorityEmpty && !isChecklistReviewTriggered,
    [isChecklistReviewTriggered, isHighPriorityEmpty]
  );

  return (
    <Context.Provider
      value={{
        checklist: currentList,
        refreshChecklist: handleRefreshList,
        currentCheckpoint: checkpointState,
        isChecklistReviewTriggered,
        focusChecklistTab,
        resetReviewDialogTrigger,
        isHighPriorityEmpty,
        shouldReviewDialogBeSeen,
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
