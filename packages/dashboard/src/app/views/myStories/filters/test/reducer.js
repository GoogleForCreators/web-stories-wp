/*
 * Copyright 2022 Google LLC
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
import reducer from '../reducer';
import * as types from '../types';

describe('reducer', () => {
  it('should update the state', () => {
    const initial_state = {
      officers: {
        filterId: 117,
        name: 'John',
      },
    };

    const args = {
      type: types.UPDATE_FILTER,
      payload: {
        filter: 'officers',
        value: { filterId: 112 },
      },
    };

    const state = reducer(initial_state, args);
    expect(state.officers.filterId).toBe(112);
  });

  it('should update set the filterId to null if the same filterId is givien', () => {
    const initial_state = {
      officers: {
        filterId: 117,
        name: 'John',
      },
    };

    const args = {
      type: types.UPDATE_FILTER,
      payload: {
        filter: 'officers',
        value: { filterId: 117 },
      },
    };

    const state = reducer(initial_state, args);
    expect(state.officers.filterId).toBeNull();
  });

  it('should return the state if dispatching an action thats not supported', () => {
    const initial_state = {
      teams: {
        filterId: 6,
        name: 'Noble',
      },
    };

    const args = {
      type: 'RENAME_TEAM',
      payload: {
        filter: 'teams',
        name: 'Banished',
      },
    };

    const state = reducer(initial_state, args);
    expect(state.teams).toMatchObject({
      filterId: 6,
      name: 'Noble',
    });
  });
});
