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
import { default as useReducer, ADD_ENTRY, EMPTY_STATE } from '../reducer';

describe('reducer', () => {
  const size = 5;
  const reducer = useReducer(size);
  it('should do nothing if unknown action given', () => {
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
  });
  // @todo CLEAR_HISTORY
  // @todo CLEAR_REPLAY_STATE
  // @todo REPLAY
});
