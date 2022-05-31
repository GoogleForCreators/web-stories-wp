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
 * External dependencies
 */

/**
 * Internal dependencies
 */
import * as types from './types';

const reducer = (state, { type, payload = {} }) => {
  switch (type) {
    case types.UPDATE_FILTER: {
      const { key, value } = payload;
      const filter = state.filters.find((f) => f.key === key);

      // remove filter by value
      if (value.filterId && filter?.filterId === value.filterId) {
        value.filterId = null;
      }

      // replace old filter
      const idx = state.filters.indexOf(filter);
      const filters = [...state.filters];
      filters[idx] = { ...filter, ...value };

      return {
        ...state,
        filters,
      };
    }

    case types.REGISTER_FILTERS: {
      return {
        ...state,
        filtersInit: true,
        filters: payload,
      };
    }
    default:
      return state;
  }
};

export default reducer;
