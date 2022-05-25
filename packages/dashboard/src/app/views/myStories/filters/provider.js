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
} from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import reducer from './reducer';
import useTaxonomyFilter from './taxonomy/useTaxonomyFilter';
import * as types from './types';

export const filterContext = createContext({
  state: {},
});

export default function FiltersProvider({ children }) {
  const taxonomy = useTaxonomyFilter();

  const [state, dispatch] = useReducer(reducer, {
    taxonomy,
  });

  const updateFilter = useCallback((filter, value) => {
    dispatch({ type: types.UPDATE_FILTER, payload: { filter, value } });
  });

  const setFilterPrimaryOptions = useCallback((filter, value) => {
    dispatch({ type: types.SET_FILTER_OPTIONS, payload: { filter, value } });
  });

  const setFilterQueiredOptions = useCallback((filter, value) => {
    dispatch({
      type: types.SET_QUEIRED_FILTER_OPTIONS,
      payload: { filter, value },
    });
  });

  useEffect(() => {
    setFilterPrimaryOptions(types.TAXONOMY, taxonomy.primaryOptions);
  }, [taxonomy.primaryOptions]);

  useEffect(() => {
    setFilterQueiredOptions(types.TAXONOMY, taxonomy.queriedOptions);
  }, [taxonomy.queriedOptions]);

  return (
    <filterContext.Provider value={[state, { updateFilter }]}>
      {children}
    </filterContext.Provider>
  );
}
