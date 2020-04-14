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
import { useReducer, useCallback } from 'react';

const ADD_ENTRY = 'add';
const CLEAR_HISTORY = 'clear';
const CLEAR_REPLAY_STATE = 'clear_replay';
const REPLAY = 'replay';

const EMPTY_STATE = {
  entries: [],
  offset: 0,
  replayState: null,
  versionNumber: 0,
};

const reducer = (size) => (state, { type, payload }) => {
  switch (type) {
    case ADD_ENTRY:
      // If not, trim `entries` from `offset` (basically destroy all undone states),
      // add new entry but limit entire storage to `size`
      // and clear `offset` and `replayState`.
      return {
        entries: [payload, ...state.entries.slice(state.offset)].slice(0, size),
        versionNumber: state.versionNumber + 1,
        offset: 0,
        replayState: null,
      };

    case CLEAR_REPLAY_STATE:
      // Clears the replayState which indicates that state change was caused by applying replay.
      if (state.replayState) {
        return {
          ...state,
          replayState: null,
        };
      }
      return state;
    case REPLAY:
      const currentEntry = state.entries[state.offset];
      const replayState = state.entries[payload];
      // If a page has changed and it was not an added page, and if the page is about to change with replay,
      // Ensure the user stays on the page where the latest change happened.
      if (
        currentEntry &&
        currentEntry.pages !== replayState.pages &&
        currentEntry.pages.length === replayState.pages.length &&
        currentEntry.current !== replayState.current
      ) {
        const changedPage = currentEntry.pages.filter((page, index) => {
          return page !== replayState.pages[index];
        });
        // If a changed page was found.
        if (changedPage.length === 1) {
          // Ensure we stay on the changed page by overriding the previously saved current page.
          const current = changedPage[0].id;
          const replay = { ...replayState, current };
          return {
            ...state,
            offset: payload,
            replayState: replay,
          };
        }
      }
      return {
        ...state,
        offset: payload,
        replayState,
      };

    case CLEAR_HISTORY:
      return {
        ...EMPTY_STATE,
      };

    default:
      throw new Error(`Unknown history reducer action: ${type}`);
  }
};

function useHistoryReducer(size) {
  // State has 3 parts:
  //
  // `state.entries` is an array of the last changes (up to `size`) to
  // the object with the most recent at position 0.
  //
  // `state.offset` is a pointer to the currently active entry. This will
  // almost always be 0 unless the user recently did an undo without making
  // any new changes since.
  //
  // `state.replayState` is the state that the user most recently tried to
  // undo/redo to - it will be null except for the very short timespan
  // between the user pressing undo and the app updating to that desired
  // state.
  const [state, dispatch] = useReducer(reducer(size), { ...EMPTY_STATE });

  const { entries, offset, replayState, versionNumber } = state;
  const historyLength = entries.length;

  // @todo: make this an identity-stable function, akin to `setState` or `dispatch`.
  // It appears the only reason for deps here is to return boolean from this
  // method, which is otherwise appears to be unused.
  const replay = useCallback(
    (deltaOffset) => {
      const newOffset = offset + deltaOffset;
      if (newOffset < 0 || newOffset > historyLength - 1) {
        return false;
      }

      dispatch({ type: REPLAY, payload: newOffset });
      return true;
    },
    [dispatch, offset, historyLength]
  );

  const undo = useCallback(
    (count = 1) => {
      return replay(typeof count === 'number' ? count : 1);
    },
    [replay]
  );

  const redo = useCallback(
    (count = 1) => {
      return replay(typeof count === 'number' ? -count : -1);
    },
    [replay]
  );

  const clearHistory = useCallback(() => {
    return dispatch({ type: CLEAR_HISTORY });
  }, [dispatch]);

  const appendToHistory = useCallback(
    (entry) => {
      dispatch({ type: ADD_ENTRY, payload: entry });
    },
    [dispatch]
  );

  const clearReplayState = useCallback(() => {
    dispatch({ type: CLEAR_REPLAY_STATE });
  }, [dispatch]);

  return {
    replayState,
    clearReplayState,
    appendToHistory,
    clearHistory,
    offset,
    historyLength,
    versionNumber,
    undo,
    redo,
  };
}

export default useHistoryReducer;
