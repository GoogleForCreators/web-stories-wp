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
import { TEMPLATES_GALLERY_SORT_OPTIONS } from '../../../../constants/templates';

describe('reducer', () => {
  it('should update the state', () => {
    const initial_state = {
      filters: [
        {
          key: 'officers',
          filterId: 117,
          name: 'John',
        },
      ],
    };

    const args = {
      type: types.UPDATE_FILTER,
      payload: {
        key: 'officers',
        value: { filterId: 112 },
      },
    };

    const state = reducer(initial_state, args);
    const filter = state.filters.find((f) => f.key === 'officers');
    expect(filter.filterId).toBe(112);
  });

  it('should update set the filterId to null if the same filterId is given, unless the filter is "search" or "status"', () => {
    let initial_state = {
      filters: [
        {
          key: 'officers',
          filterId: 117,
          name: 'John',
        },
      ],
    };

    let args = {
      type: types.UPDATE_FILTER,
      payload: {
        key: 'officers',
        value: { filterId: 117 },
      },
    };

    let state = reducer(initial_state, args);
    let filter = state.filters.find((f) => f.key === 'officers');
    expect(filter.filterId).toBeNull();

    initial_state = {
      filters: [
        { key: 'search', filterId: 'John' },
        { key: 'status', filterId: 'New' },
      ],
    };
    // search
    args = {
      type: types.UPDATE_FILTER,
      payload: {
        key: 'search',
        value: 'John',
      },
    };

    state = reducer(initial_state, args);
    filter = state.filters.find((f) => f.key === 'search');
    expect(filter.filterId).toBe('John');

    // status
    args = {
      type: types.UPDATE_FILTER,
      payload: {
        key: 'status',
        value: 'New',
      },
    };

    state = reducer(initial_state, args);
    filter = state.filters.find((f) => f.key === 'status');
    expect(filter.filterId).toBe('New');
  });

  it('should register filters in state', () => {
    const initial_state = {
      filters: [],
    };

    const args = {
      type: types.REGISTER_FILTERS,
      payload: {
        value: [
          {
            key: 'officers',
            filterId: null,
          },
          {
            key: 'teams',
            filterId: null,
          },
        ],
      },
    };

    const state = reducer(initial_state, args);
    expect(state.filters).toHaveLength(2);
  });

  it('should return the state if dispatching an action thats not supported', () => {
    const initial_state = {
      filters: [
        {
          key: 'teams',
          filterId: 6,
          name: 'Noble',
        },
      ],
    };

    const args = {
      type: 'RENAME_TEAM',
      payload: {
        key: 'teams',
        name: 'Banished',
      },
    };

    const state = reducer(initial_state, args);
    const filter = state.filters.find((f) => f.key === 'teams');
    expect(filter).toMatchObject({
      filterId: 6,
      name: 'Noble',
    });
  });

  it('should return the state if no filter is found with the key', () => {
    const initial_state = {
      filters: [
        {
          key: 'teams',
          filterId: 6,
          name: 'Noble',
        },
      ],
    };

    const args = {
      type: 'UPDATE_FILTER',
      payload: {
        key: 'officers',
        name: 'Banished',
      },
    };

    const state = reducer(initial_state, args);
    expect(state).toMatchObject(initial_state);
  });

  it('should update sort based on "type" and acceptable keys', () => {
    const initial_state = {
      sortObject: {},
    };

    let args = {
      type: 'UPDATE_SORT',
      payload: {
        type: 'template',
        values: { orderby: TEMPLATES_GALLERY_SORT_OPTIONS.POPULAR },
      },
    };

    let state = reducer(initial_state, args);
    expect(state.sortObject).toMatchObject({
      orderby: TEMPLATES_GALLERY_SORT_OPTIONS.POPULAR,
    });

    args = {
      type: 'UPDATE_SORT',
      payload: { type: 'template', values: { orderby: 'non-popular' } },
    };

    state = reducer(state, args);
    // state shouldn't change because 'non-popular' is not an acceptable value
    // for 'template' sort 'orderby'
    expect(state.sortObject).toMatchObject({
      orderby: TEMPLATES_GALLERY_SORT_OPTIONS.POPULAR,
    });
  });
});
