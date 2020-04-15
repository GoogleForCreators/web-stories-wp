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
 * Internal dependencies
 */
import {
  default as useReducer,
  ADD_ENTRY,
  CLEAR_HISTORY,
  CLEAR_REPLAY_STATE,
  EMPTY_STATE,
  REPLAY,
} from '../reducer';

describe('reducer', () => {
  const size = 5;
  const reducer = useReducer(size);
  it('should throw error if unknown action given', () => {
    expect(() =>
      reducer(EMPTY_STATE, {
        type: 'UNKNOWN_ACTION',
        payload: {},
      })
    ).toThrow(/Unknown history reducer action: UNKNOWN_ACTION/i);
  });

  describe('addEntry', () => {
    it('should add entry to the beginning of the history', () => {
      const initialState = {
        ...EMPTY_STATE,
        entries: [{ id: 1 }],
      };

      const newEntry = { id: 2 };
      const result = reducer(initialState, {
        type: ADD_ENTRY,
        payload: newEntry,
      });

      expect(result.entries[0]).toStrictEqual(newEntry);
    });

    it('should clear undone states when adding a new entry', () => {
      const initialState = {
        ...EMPTY_STATE,
        entries: [{ id: 1 }, { id: 2 }, { id: 3 }],
        offset: 2,
      };
      const newEntry = { id: 4 };
      const result = reducer(initialState, {
        type: ADD_ENTRY,
        payload: newEntry,
      });

      expect(result.entries).toHaveLength(2);
      expect(result.entries[1].id).toStrictEqual(3);
      expect(result.entries[0].id).toStrictEqual(4);
    });

    it('should set correct state values when adding new entry', () => {
      const initialState = {
        ...EMPTY_STATE,
        versionNumber: 3,
        entries: [{ id: 1 }],
        offset: 2,
      };
      const newEntry = { id: 2 };
      const result = reducer(initialState, {
        type: ADD_ENTRY,
        payload: newEntry,
      });

      expect(result.versionNumber).toStrictEqual(4);
      expect(result.offset).toStrictEqual(0);
    });

    it('should respect the determined history size when adding a new entry', () => {
      const entries = [...Array(size + 1)].map(() => {
        return { id: 'foo' };
      });
      const initialState = {
        ...EMPTY_STATE,
        entries,
      };
      const newEntry = { id: 7 };
      const result = reducer(initialState, {
        type: ADD_ENTRY,
        payload: newEntry,
      });
      expect(result.entries).toHaveLength(size);
    });
  });

  describe('clearHistory', () => {
    it('should set initial state when clearing history', () => {
      const initialState = {
        offset: 1,
        replayState: { id: 1 },
        entries: [{ id: 1 }],
        versionNumber: 1,
      };

      const result = reducer(initialState, {
        type: CLEAR_HISTORY,
      });

      expect(result).toMatchObject(EMPTY_STATE);
    });
  });

  describe('clearReplayState', () => {
    it('should clear replay state', () => {
      const initialState = {
        ...EMPTY_STATE,
        replayState: { id: 1 },
      };

      const result = reducer(initialState, {
        type: CLEAR_REPLAY_STATE,
      });

      expect(result.replayState).toBeNull();
    });

    it('should not modify the state if replayState is not set', () => {
      const result = reducer(EMPTY_STATE, {
        type: CLEAR_REPLAY_STATE,
      });

      expect(result).toStrictEqual(EMPTY_STATE);
    });
  });

  describe('replay', () => {
    it('should set the correct offset when replaying', () => {
      const initialState = {
        ...EMPTY_STATE,
        entries: [{ id: 1 }, { id: 2 }],
      };

      const result = reducer(initialState, {
        type: REPLAY,
        payload: 1,
      });

      expect(result.offset).toStrictEqual(1);
    });

    it('should set the correct replayState when replaying', () => {
      const replay = { id: 1 };
      const initialState = {
        ...EMPTY_STATE,
        entries: [{ id: 2 }, replay],
      };

      const result = reducer(initialState, {
        type: REPLAY,
        payload: 1,
      });

      expect(result.replayState).toStrictEqual(replay);
    });

    it('should set replay the current page relevant to the latest replayed change', () => {
      const initialState = {
        ...EMPTY_STATE,
        entries: [
          { current: 1, pages: [{ id: 1, foo: 'bar' }] },
          { current: 2, pages: [{ id: 2, foo: 'foo' }] },
        ],
      };

      const result = reducer(initialState, {
        type: REPLAY,
        payload: 1,
      });

      expect(result.replayState.current).toStrictEqual(1);
      expect(result.replayState.pages[0].id).toStrictEqual(2);
    });

    it('should not dynamically set the replay if changed happened on more than one page', () => {
      const initialState = {
        ...EMPTY_STATE,
        entries: [
          {
            current: 1,
            pages: [
              { id: 1, foo: 'bar' },
              { id: 2, foo: 'bar' },
            ],
          },
          {
            current: 2,
            pages: [
              { id: 1, foo: 'foo' },
              { id: 2, foo: 'foo' },
            ],
          },
        ],
      };

      const result = reducer(initialState, {
        type: REPLAY,
        payload: 1,
      });

      expect(result.replayState.current).toStrictEqual(2);
    });

    it('should not dynamically set the replay if a page was added', () => {
      const initialState = {
        ...EMPTY_STATE,
        entries: [
          { current: 1, pages: [{ id: 1, foo: 'bar' }] },
          {
            current: 2,
            pages: [
              { id: 2, foo: 'foo' },
              { id: 1, foo: 'bar' },
            ],
          },
        ],
      };

      const result = reducer(initialState, {
        type: REPLAY,
        payload: 1,
      });

      expect(result.replayState.current).toStrictEqual(2);
    });
  });
});
