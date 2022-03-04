/*
 * Copyright 2021 Google LLC
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
import {
  useEffect,
  useState,
  useCallback,
  useReducer,
  useMemo,
  createContext,
  useContextSelector,
  identity,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';
/**
 * Internal dependencies
 */
import { STORY_EVENTS, useStory, useStoryTriggerListener } from '../../../app';
import { PPC_CHECKPOINT_STATE } from '../constants';

export const PPC_CHECKPOINT_ACTION = {
  ON_INITIAL_ELEMENT_ADDED: 'story is no longer empty',
  ON_PUBLISH_CLICKED: 'publish button is pressed',
  ON_STORY_HAS_2_PAGES: "story 'recommended' section enabled",
  ON_STORY_HAS_5_PAGES: "story 'high priority' section enabled",
  ON_STORY_IS_PUBLISHED: 'story is published, regardless of recommendations',
};

const machine = {
  [PPC_CHECKPOINT_STATE.UNAVAILABLE]: {
    [PPC_CHECKPOINT_ACTION.ON_INITIAL_ELEMENT_ADDED]:
      PPC_CHECKPOINT_STATE.ONLY_RECOMMENDED,
    [PPC_CHECKPOINT_ACTION.ON_PUBLISH_CLICKED]: PPC_CHECKPOINT_STATE.ALL,
    [PPC_CHECKPOINT_ACTION.ON_STORY_IS_PUBLISHED]: PPC_CHECKPOINT_STATE.ALL,
    [PPC_CHECKPOINT_ACTION.ON_STORY_HAS_2_PAGES]:
      PPC_CHECKPOINT_STATE.ONLY_RECOMMENDED,
  },
  [PPC_CHECKPOINT_STATE.ONLY_RECOMMENDED]: {
    [PPC_CHECKPOINT_ACTION.ON_STORY_HAS_5_PAGES]: PPC_CHECKPOINT_STATE.ALL,
    [PPC_CHECKPOINT_ACTION.ON_PUBLISH_CLICKED]: PPC_CHECKPOINT_STATE.ALL,
    [PPC_CHECKPOINT_ACTION.ON_STORY_IS_PUBLISHED]: PPC_CHECKPOINT_STATE.ALL,
  },
  [PPC_CHECKPOINT_STATE.ALL]: {},
};

const checkpointReducer = (state, action) => {
  return machine[state][action] || state;
};

export const CheckpointContext = createContext({ state: {}, actions: {} });

function ChecklistCheckpointProvider({ children }) {
  const [checkpointState, dispatch] = useReducer(
    checkpointReducer,
    PPC_CHECKPOINT_STATE.UNAVAILABLE
  );

  const [highPriorityCount, setHighPriorityCount] = useState();
  const [reviewDialogRequested, setReviewDialogRequested] = useState();

  const shouldReviewDialogBeSeen =
    highPriorityCount > 0 ||
    [
      PPC_CHECKPOINT_STATE.UNAVAILABLE,
      PPC_CHECKPOINT_STATE.ONLY_RECOMMENDED,
    ].includes(checkpointState);

  const storyStatus = useStory(({ state: { story } }) => story.status);

  useEffect(() => {
    if (storyStatus === 'publish') {
      dispatch(PPC_CHECKPOINT_ACTION.ON_STORY_IS_PUBLISHED);
    }
  }, [storyStatus]);

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

  const updateHighPriorityCount = useCallback((count) => {
    setHighPriorityCount(count);
  }, []);

  const onReviewDialogRequest = useCallback(() => {
    setReviewDialogRequested(true);
    dispatch(PPC_CHECKPOINT_ACTION.ON_PUBLISH_CLICKED);
  }, []);

  const showPriorityIssues = useCallback(
    () => dispatch(PPC_CHECKPOINT_ACTION.ON_PUBLISH_CLICKED),
    []
  );

  // TODO: when #10115 feature flag is getting deprecated, the review dialog request dispatch should be cleaned up
  const onPublishDialogChecklistRequest = useCallback(() => {
    setReviewDialogRequested(true);
  }, []);

  const onResetReviewDialogRequest = useCallback(() => {
    setReviewDialogRequested(false);
  }, []);

  const value = useMemo(
    () => ({
      state: {
        checkpoint: checkpointState,
        shouldReviewDialogBeSeen,
        reviewDialogRequested,
      },
      actions: {
        updateHighPriorityCount,
        onReviewDialogRequest,
        onResetReviewDialogRequest,
        onPublishDialogChecklistRequest,
        showPriorityIssues,
      },
    }),
    [
      checkpointState,
      onPublishDialogChecklistRequest,
      showPriorityIssues,
      onReviewDialogRequest,
      onResetReviewDialogRequest,
      reviewDialogRequested,
      shouldReviewDialogBeSeen,
      updateHighPriorityCount,
    ]
  );

  return (
    <CheckpointContext.Provider value={value}>
      {children}
    </CheckpointContext.Provider>
  );
}
ChecklistCheckpointProvider.propTypes = {
  children: PropTypes.node,
};

export function useCheckpoint(selector) {
  return useContextSelector(CheckpointContext, selector ?? identity);
}

export { ChecklistCheckpointProvider };
