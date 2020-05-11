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

/**
 * Internal dependencies
 */
import reducer, {
  SET_CURRENT_STATE,
  CLEAR_HISTORY,
  REPLAY,
  EMPTY_STATE,
} from './reducer';

function useHistoryReducer(size) {
  // State has 4 parts:
  //
  // `state.entries` is an array of the last changes (up to `size`) to
  // the object with the most recent at position 0.
  //
  // `state.offset` is a pointer to the currently active entry. This will
  // almost always be 0 unless the user recently did an undo without making
  // any new changes since.
  //
  // `state.requestedState` is the state that the user most recently tried to
  // undo/redo to - it will be null except for the very short timespan
  // between the user pressing undo and the app updating to that desired
  // state.
  //
  // `state.versionNumber` tracks the version number of the state.
  // The version number is increased whenever a new entry is added.
  // Undo and redo decrease and increase the version number respectively.
  const [state, dispatch] = useReducer(reducer(size), { ...EMPTY_STATE });

  const { entries, offset, requestedState, versionNumber } = state;
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

  const stateToHistory = useCallback(
    (entry) => {
      dispatch({ type: SET_CURRENT_STATE, payload: entry });
    },
    [dispatch]
  );

  return {
    requestedState,
    stateToHistory,
    clearHistory,
    offset,
    historyLength,
    versionNumber,
    undo,
    redo,
  };
}

export default useHistoryReducer;
