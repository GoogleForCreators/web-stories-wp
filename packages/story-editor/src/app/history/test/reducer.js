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
  SET_CURRENT_STATE,
  CLEAR_HISTORY,
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

  describe('setCurrentState', () => {
    it('should add entry to the beginning of the history', () => {
      const initialState = {
        ...EMPTY_STATE,
        entries: [{ id: 1 }],
      };

      const newEntry = { id: 2 };
      const result = reducer(initialState, {
        type: SET_CURRENT_STATE,
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
        type: SET_CURRENT_STATE,
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
        entries: [{ id: 1 }, { id: 2 }, { id: 3 }],
        offset: 2,
      };
      const newEntry = { id: 2 };
      const result = reducer(initialState, {
        type: SET_CURRENT_STATE,
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
        type: SET_CURRENT_STATE,
        payload: newEntry,
      });
      expect(result.entries).toHaveLength(size);
    });

    it('should set the correct values when replaying', () => {
      const requestedState = { id: 1 };
      const initialState = {
        ...EMPTY_STATE,
        entries: [{ id: 2 }, requestedState],
        requestedState,
      };

      const result = reducer(initialState, {
        type: SET_CURRENT_STATE,
        payload: requestedState,
      });

      expect(result.offset).toStrictEqual(1);
      expect(result.requestedState).toBeNull();
      expect(result.entries).toHaveLength(initialState.entries.length);
    });

    it('should dynamically set the current page based on the relevant change', () => {
      const requestedState = { current: 2, pages: [{ id: 2, foo: 'foo' }] };
      const initialState = {
        ...EMPTY_STATE,
        entries: [
          { current: 1, pages: [{ id: 1, foo: 'bar' }] },
          requestedState,
        ],
        requestedState,
      };

      const result = reducer(initialState, {
        type: SET_CURRENT_STATE,
        payload: requestedState,
      });

      expect(result.requestedState.current).toStrictEqual(1);
      expect(result.requestedState.pages[0].id).toStrictEqual(2);
    });

    it('should not dynamically set the replay if changed happened on more than one page', () => {
      const requestedState = {
        current: 1,
        pages: [
          { id: 1, foo: 'bar' },
          { id: 2, foo: 'bar' },
        ],
      };
      const initialState = {
        ...EMPTY_STATE,
        entries: [
          {
            current: 2,
            pages: [
              { id: 1, foo: 'foo' },
              { id: 2, foo: 'foo' },
            ],
          },
          requestedState,
        ],
        requestedState,
      };

      const result = reducer(initialState, {
        type: SET_CURRENT_STATE,
        payload: requestedState,
      });

      expect(result.requestedState).toBeNull();
      expect(result.offset).toStrictEqual(1);
    });

    it('should not dynamically set the replay if a page was added', () => {
      const requestedState = { current: 1, pages: [{ id: 1, foo: 'bar' }] };
      const initialState = {
        ...EMPTY_STATE,
        entries: [
          {
            current: 2,
            pages: [
              { id: 2, foo: 'foo' },
              { id: 1, foo: 'bar' },
            ],
          },
          requestedState,
        ],
        requestedState,
      };

      const result = reducer(initialState, {
        type: SET_CURRENT_STATE,
        payload: requestedState,
      });

      expect(result.requestedState).toBeNull();
      expect(result.offset).toStrictEqual(1);
    });
  });

  describe('clearHistory', () => {
    it('should set empty state when clearing history', () => {
      const initialState = {
        offset: 1,
        requestedState: { id: 1 },
        entries: [{ id: 1 }],
        versionNumber: 1,
      };

      const result = reducer(initialState, {
        type: CLEAR_HISTORY,
      });

      expect(result).toMatchObject(EMPTY_STATE);
    });
  });

  describe('replay', () => {
    it('should set the correct requestedState when replaying', () => {
      const replay = { id: 1 };
      const initialState = {
        ...EMPTY_STATE,
        entries: [{ id: 2 }, replay],
      };

      const result = reducer(initialState, {
        type: REPLAY,
        payload: 1,
      });

      expect(result.requestedState).toStrictEqual(replay);
    });

    it('should set the correct versionNumber when replaying', () => {
      const replay = { id: 1 };
      const initialState = {
        ...EMPTY_STATE,
        versionNumber: 4,
        offset: 3,
        entries: [{ id: 2 }, replay],
      };

      const result1 = reducer(initialState, {
        type: REPLAY,
        payload: 2,
      });

      expect(result1.versionNumber).toStrictEqual(5);

      const result2 = reducer(initialState, {
        type: REPLAY,
        payload: 5,
      });
      expect(result2.versionNumber).toStrictEqual(2);
    });
  });
});
