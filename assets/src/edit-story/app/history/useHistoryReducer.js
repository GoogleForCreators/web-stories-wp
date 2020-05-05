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
      // First check if everything in payload matches the current `replayState`,
      // if so, update `offset` to match the state in entries and clear `replayState`
      // and of course leave entries unchanged.
      if (state.replayState) {
        const isReplay = Object.keys(state.replayState).every(
          (key) => state.replayState[key] === payload[key]
        );

        if (isReplay) {
          return {
            ...state,
            offset: state.entries.indexOf(state.replayState),
            replayState: null,
          };
        }
      }

      // If not, trim `entries` from `offset` (basically destroy all undone states),
      // add new entry but limit entire storage to `size`
      // and clear `offset` and `replayState`.
      return {
        entries: [payload, ...state.entries.slice(state.offset)].slice(0, size),
        versionNumber: state.versionNumber + 1,
        offset: 0,
        replayState: null,
      };

    case REPLAY:
      return {
        ...state,
        versionNumber: state.versionNumber + (state.offset - payload),
        replayState: state.entries[payload],
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

  return {
    replayState,
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
