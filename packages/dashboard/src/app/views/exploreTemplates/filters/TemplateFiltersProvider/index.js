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
  useCallback,
  useMemo,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { DEFAULT_TEMPLATE_FILTERS } from '../../../../../constants/templates';
import reducer from '../../../filters/reducer';
import * as types from '../../../filters/types';

export const filterContext = createContext({
  state: {},
  actions: {},
});

const { filters: defaultTemplateFilters, sort: defaultTemplateSort } =
  DEFAULT_TEMPLATE_FILTERS;

export default function TemplateFiltersProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    filters: [],
    filtersObject: defaultTemplateFilters,
    sortObject: defaultTemplateSort,
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
   * Dispatch UPDATE_SORT with new data to update sort
   *
   * @param {string} key key property on one of the sort objects
   * @param {Object} value the properties with updated values
   * @return {void}
   */
  const updateSort = useCallback((values) => {
    dispatch({
      type: types.UPDATE_SORT,
      payload: { type: 'template', values },
    });
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

  const contextValue = useMemo(() => {
    return { state, actions: { updateSort, updateFilter, registerFilters } };
  }, [state, updateSort, updateFilter, registerFilters]);

  return (
    <filterContext.Provider value={contextValue}>
      {children}
    </filterContext.Provider>
  );
}

TemplateFiltersProvider.propTypes = {
  children: PropTypes.node,
};
