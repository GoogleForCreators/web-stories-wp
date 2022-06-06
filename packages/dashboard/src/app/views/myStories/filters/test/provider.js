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
import { renderHook, act } from '@testing-library/react-hooks';

/**
 * Internal dependencies
 */
import FiltersProvider from '../provider';
import useFilters from '../useFilters';

jest.mock('../taxonomy/useTaxonomyFilters', () => {
  const initializeTaxonomyFilters = () => [];
  return {
    __esModule: true,
    default: function useTaxonomyFilter() {
      const react = jest.requireActual('react');
      const [taxonomies] = react.useState([]);

      return {
        taxonomies,
        initializeTaxonomyFilters,
      };
    },
  };
});

describe('provider', () => {
  it('should register filters and update filters', () => {
    const wrapper = ({ children }) => (
      <FiltersProvider>{children}</FiltersProvider>
    );

    const { result } = renderHook(() => useFilters(), { wrapper });
    const filterKey = 'web_story_category';

    // register filter
    act(() => {
      result.current.actions.registerFilters([
        { key: filterKey, filterId: null },
      ]);
    });

    let filter = result.current.state.filters.find((f) => f.key === filterKey);
    expect(filter).toBeDefined();

    // update the filter
    act(() => {
      result.current.actions.updateFilter(filterKey, {
        filterId: 1,
      });
    });

    filter = result.current.state.filters.find((f) => f.key === filterKey);
    expect(filter).toMatchObject({
      filterId: 1,
    });
  });
});
