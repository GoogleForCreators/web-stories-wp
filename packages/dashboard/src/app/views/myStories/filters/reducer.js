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
      const filter = state.filters.find((f) => f.key === key);

      if (!filter) {
        return state;
      }

      // remove 'filter-by' value
      if (value.filterId && filter?.filterId === value.filterId) {
        value.filterId = null;
      }

      // replace old filter
      const idx = state.filters.indexOf(filter);
      const filters = [...state.filters];
      filters[idx] = { ...filter, ...value };

      // update filtersObject
      const filtersObject = {};
      for (const f of filters) {
        if (f.filterId) {
          filtersObject[f.key] = f.filterId;
        }
      }

      return {
        ...state,
        filters,
        filtersObject,
      };
    }

    case types.REGISTER_FILTERS: {
      const { value } = payload;
      const currentFilters = state.filters.map((f) => f.key);
      const newFilters = value.filter((v) => !currentFilters.includes(v.key));
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
