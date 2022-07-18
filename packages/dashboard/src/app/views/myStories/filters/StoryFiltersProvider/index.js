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

/** @typedef {import('react')} Node */

/**
 * Internal dependencies
 */
import reducer from '../../../filters/reducer';
import * as types from '../../../filters/types';
import useTaxonomyFilters from './taxonomy/useTaxonomyFilters';
import useAuthorFilter from './author/useAuthorFilter';

export const filterContext = createContext({
  state: {},
  actions: {},
});

/**
 * Keeps track of the current filters state.
 *
 * Each filter will have its own logic associated with
 * initilization and how to query terms.
 *
 * state.filters should be used for UI.
 * state.filtersObject should hold the key value pairs associated with filtering query params
 * eg {author: 44} where 'author' is whats being filtered on and '44' is the authors ID
 * thats being filtered for.
 *
 * @param {Object} root0 props for the provider
 * @param {Node} root0.children the children to be rendered
 * @return {Node} React node
 */

export default function StoryFiltersProvider({ children }) {
  // each filter type will have its own logic for initilizing and querying
  const initializeTaxonomyFilters = useTaxonomyFilters();
  const initializeAuthorFilter = useAuthorFilter();

  const [state, dispatch] = useReducer(reducer, {
    filters: [],
    filtersObject: {},
    sortObject: {},
  });

  /**
   * Dispatch UPDATE_SORT with new data to update sort
   *
   * @param {string} key key property on one of the sort objects
   * @param {Object} value the properties with updated values
   * @return {void}
   */
  const updateSort = useCallback((values) => {
    dispatch({ type: types.UPDATE_SORT, payload: { type: 'story', values } });
  }, []);

  /**
   * Dispatch UPDATE_FILTER with new data for a given filter
   *
   * @param {string} key key property on one of the filter objects
   * @param {Object} value the properties with updated values
   * @return {void}
   */
  const updateFilter = useCallback((key, value) => {
    dispatch({ type: types.UPDATE_FILTER, payload: { key, value } });
  }, []);

  /**
   * Dispatch REGISTER_FILTERS with all the filters data
   *
   * @param {Array} payload array of filters data
   * @return {void}
   */
  const registerFilters = useCallback((value) => {
    dispatch({ type: types.REGISTER_FILTERS, payload: { value } });
  }, []);

  /**
   * Sets up the shape of the filters data
   * and calls registerFilters with all filters.
   *
   * @return {void}
   */
  const initializeStoryFilters = useCallback(async () => {
    const taxonomies = await initializeTaxonomyFilters();
    const author = initializeAuthorFilter();

    const filters = [...taxonomies, author].filter((filter) => Boolean(filter));

    if (filters.length) {
      registerFilters(filters);
    }
  }, [registerFilters, initializeAuthorFilter, initializeTaxonomyFilters]);

  const contextValue = useMemo(() => {
    return {
      state,
      actions: { updateFilter, updateSort, registerFilters },
    };
  }, [state, updateFilter, updateSort, registerFilters]);

  useEffect(() => {
    initializeStoryFilters();
  }, [initializeStoryFilters]);

  return (
    <filterContext.Provider value={contextValue}>
      {children}
    </filterContext.Provider>
  );
}

StoryFiltersProvider.propTypes = {
  children: PropTypes.node,
};
