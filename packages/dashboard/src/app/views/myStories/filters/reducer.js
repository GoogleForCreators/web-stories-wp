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
import { SORT_KEYS } from '../../../../constants/stories';
import * as types from './types';

/**
 * Update the filters state
 *
 * TODO: May need updating to handle all filter types within the dashboard.
 *
 * @param {Object} state Current state
 * @param {Object} payload Action payload
 * @param {string} payload.key Key for associated filter.
 * @param {Object} payload.value Value to set on the filter.
 * @return {Object} New state
 */

const reducer = (state, { type, payload = {} }) => {
  switch (type) {
    case types.UPDATE_FILTER: {
      const { key, value } = payload;
      const _filter = state.filters.find((filter) => filter.key === key);

      if (!_filter) {
        return state;
      }

      // remove 'filter-by' value
      if (value.filterId && _filter?.filterId === value.filterId) {
        value.filterId = null;
      }

      // replace old filter
      const idx = state.filters.indexOf(_filter);
      const filters = [...state.filters];
      filters[idx] = { ..._filter, ...value };

      // update filtersObject
      const filtersObject = {};
      for (const filter of filters) {
        if (filter.filterId) {
          filtersObject[filter.key] = filter.filterId;
        }
      }

      return {
        ...state,
        filters,
        filtersObject,
      };
    }

    case types.UPDATE_SORT: {
      const { values } = payload;

      const sortObject = {};

      // only use acceptable key value pairs
      for (const key in values) {
        if (
          key in SORT_KEYS &&
          Object.values(SORT_KEYS[key]).includes(values[key]) &&
          state.sortObject[key] !== values[key]
        ) {
          sortObject[key] = values[key];
        }
      }

      // nothing changed no need for an update
      if (Object.entries(sortObject).length === 0) {
        return state;
      }

      return {
        ...state,
        sortObject: { ...state.sortObject, ...sortObject },
      };
    }

    case types.REGISTER_FILTERS: {
      const { value } = payload;
      const currentFilters = state.filters.map((filter) => filter.key);
      const newFilters = value.filter(
        (filter) => !currentFilters.includes(filter.key)
      );
      if (!newFilters.length) {
        return state;
      }
      return {
        ...state,
        filters: [...newFilters, ...state.filters],
      };
    }
    default:
      return state;
  }
};

export default reducer;
