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
import reducer from './reducer';
import useTaxonomyFilters from './taxonomy/useTaxonomyFilters';
import * as types from './types';

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
 *
 * @param {Object} root0 props for the provider
 * @param {Node} root0.children the children to be rendered
 * @return {Node} React node
 */

export default function FiltersProvider({ children }) {
  // each filter type will have its own logic for initilizing and querying
  const { initializeTaxonomyFilters } = useTaxonomyFilters();

  const [state, dispatch] = useReducer(reducer, {
    filtersLoading: true,
    filters: [],
  });

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
  const initializeFilters = useCallback(() => {
    const filters = initializeTaxonomyFilters();

    registerFilters(filters);
  }, [registerFilters, initializeTaxonomyFilters]);

  /**
   * Returns a object where the keys are the filter keys
   * and the values are the filterId
   *
   * @return {Object}
   */
  const getFiltersObject = useCallback(() => {
    const filterObj = {};
    for (const filter of state.filters) {
      const { key, filterId } = filter;
      if (filterId) {
        filterObj[key] = filterId;
      }
    }
    return filterObj;
  }, [state.filters]);

  const contextValue = useMemo(() => {
    return {
      state,
      actions: { updateFilter, registerFilters, getFiltersObject },
    };
  }, [state, updateFilter, registerFilters, getFiltersObject]);

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
