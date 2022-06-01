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
import {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import useTaxonomyFilters from './taxonomy/useTaxonomyFilters';
import * as types from './types';

export const filterContext = createContext({
  state: {},
  actions: {},
});

export default function FiltersProvider({ children }) {
  const { taxonomies, queryTaxonomyTerm } = useTaxonomyFilters();

  const [state, dispatch] = useReducer(reducer, {
    filtersLoading: true,
    filters: [],
  });

  const updateFilter = useCallback((key, value) => {
    dispatch({ type: types.UPDATE_FILTER, payload: { key, value } });
  }, []);

  const registerFilters = useCallback((payload) => {
    dispatch({ type: types.REGISTER_FILTERS, payload });
  }, []);

  // register the filters in state
  const initializeFilters = useCallback(() => {
    const filters = taxonomies.map((taxonomy) => ({
      key: taxonomy.restBase,
      restPath: taxonomy.restPath,
      placeholder: taxonomy.name,
      filterId: null,
      primaryOptions: taxonomy.data,
      queriedOptions: taxonomy.data,
      query: queryTaxonomyTerm,
    }));

    registerFilters(filters);
  }, [taxonomies]);

  const contextValue = useMemo(() => {
    return {
      state,
      actions: { updateFilter },
    };
  }, [state, updateFilter]);

  useEffect(() => {
    initializeFilters();
  }, [initializeFilters]);

  return (
    <filterContext.Provider value={contextValue}>
      {children}
    </filterContext.Provider>
  );
}

FiltersProvider.propTypes = {
  children: PropTypes.node,
};
