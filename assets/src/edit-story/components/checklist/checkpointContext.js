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
import { useEffect, useState, useCallback, useReducer, useMemo } from 'react';
import PropTypes from 'prop-types';
/**
 * Internal dependencies
 */
import { createContext } from '../../../design-system/utils/context';
import { useContextSelector, identity } from '../../../design-system';
import { STORY_EVENTS, useStory, useStoryTriggerListener } from '../../app';
import {
  checkpointReducer,
  PPC_CHECKPOINT_STATE,
  PPC_CHECKPOINT_ACTION,
} from './checkpointState';

export const CheckpointContext = createContext({ state: {}, actions: {} });

function ChecklistCheckpointProvider({ children }) {
  const [checkpointState, dispatch] = useReducer(
    checkpointReducer,
    PPC_CHECKPOINT_STATE.UNAVAILABLE
  );

  const [highPriorityCount, setHighPriorityCount] = useState();

  // TODO get highPriorityCount to track without opening popup first
  // this should be && not ||
  // If checkpoint hasn't hit ALL yet and the count is over 0, should see review dialog
  const shouldReviewDialogBeSeen =
    highPriorityCount > 0 ||
    [
      PPC_CHECKPOINT_STATE.UNAVAILABLE,
      PPC_CHECKPOINT_STATE.ONLY_RECOMMENDED,
    ].includes(checkpointState);

  const story = useStory(({ state: { story, pages } }) => {
    return { ...story, pages };
  });

  useEffect(() => {
    if (story.status === 'publish') {
      dispatch(PPC_CHECKPOINT_ACTION.ON_STORY_IS_PUBLISHED);
    }
  }, [story.status]);

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

  const value = useMemo(
    () => ({
      state: { checkpoint: checkpointState, shouldReviewDialogBeSeen },
      actions: { updateHighPriorityCount },
    }),
    [checkpointState, shouldReviewDialogBeSeen, updateHighPriorityCount]
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
  const context = useContextSelector(CheckpointContext, selector ?? identity);
  if (!context) {
    throw new Error(
      'Must use `useCheckpoint` within <checkpointContext.Provider />'
    );
  }
  return context;
}
export { ChecklistCheckpointProvider };
