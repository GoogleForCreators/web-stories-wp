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
import FiltersProvider from '..';
import useStoryFilters from '../useStoryFilters';
import { SORT_KEYS } from '../../../../../constants/stories';

jest.mock('../StoryFiltersProvider/taxonomy/useTaxonomyFilters', () => {
  const initializeTaxonomyFilters = () => Promise.resolve([]);
  return {
    __esModule: true,
    default: function useTaxonomyFilter() {
      return initializeTaxonomyFilters;
    },
  };
});

jest.mock('../author/useAuthorFilter', () => {
  const initializeAuthorFilter = () => null;
  return {
    __esModule: true,
    default: function useAuthorFilter() {
      return initializeAuthorFilter;
    },
  };
});

describe('provider', () => {
  it('should register filters and update filters', () => {
    const wrapper = ({ children }) => (
      <FiltersProvider>{children}</FiltersProvider>
    );

    const { result } = renderHook(() => useStoryFilters(), { wrapper });
    const filterKey = 'web_story_category';

    // register filter
    act(() => {
      result.current.actions.registerFilters([
        { key: filterKey, filterId: null },
      ]);
    });

    // shouldn't be able to register filters with the same key
    act(() => {
      result.current.actions.registerFilters([{ key: filterKey, filterId: 1 }]);
    });

    expect(result.current.state.filters).toHaveLength(1);
    let filter = result.current.state.filters.find((f) => f.key === filterKey);
    expect(filter).toBeDefined();
    expect(filter.filterId).toBeNull();

    // filters with falsy filterId's should not be in the filters object
    let filterObj = result.current.state.filtersObject;
    expect(filterObj).toMatchObject({});

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

    filterObj = result.current.state.filtersObject;
    expect(filterObj).toMatchObject({
      [filterKey]: 1,
    });
  });

  it('should be able to update the sortObject if the acceptable keys are use', () => {
    const wrapper = ({ children }) => (
      <FiltersProvider>{children}</FiltersProvider>
    );

    const { result } = renderHook(() => useStoryFilters(), { wrapper });

    for (const key of Object.keys(SORT_KEYS)) {
      for (const value of Object.values(SORT_KEYS[key])) {
        act(() => {
          result.current.actions.updateSort({ [key]: value });
        });
        expect(result.current.state.sortObject).toMatchObject({ [key]: value });
      }
    }
  });

  it('should not be able to update the sortObject with arbitrary key value pairs', () => {
    const wrapper = ({ children }) => (
      <FiltersProvider>{children}</FiltersProvider>
    );

    const { result } = renderHook(() => useStoryFilters(), { wrapper });

    const unacceptableSortValues = {
      orderby: 'valueNotInSortKeyOrderby',
      order: 'up',
    };

    const unacceptableSortKeys = {
      sortby: 'title',
      sortorder: 'asc',
    };

    act(() => {
      result.current.actions.updateSort(unacceptableSortValues);
    });
    expect(result.current.state.sortObject).toMatchObject({});

    act(() => {
      result.current.actions.updateSort(unacceptableSortKeys);
    });
    expect(result.current.state.sortObject).toMatchObject({});
  });

  it('should not return sortObject if nothing changes', () => {
    const wrapper = ({ children }) => (
      <FiltersProvider>{children}</FiltersProvider>
    );

    const { result } = renderHook(() => useStoryFilters(), { wrapper });

    const acceptableSortObject = {
      orderby: 'title',
      order: 'asc',
    };

    const unacceptableSortKeys = {
      sortby: 'title',
      sortorder: 'asc',
    };

    act(() => {
      // set the sortObject to an acceptable sortObject
      result.current.actions.updateSort(acceptableSortObject);
      // try to set the sortObject to an unacceptable sortObject
      result.current.actions.updateSort(unacceptableSortKeys);
    });
    // the state shouldn't be updated if given an unacceptable sortObject
    expect(result.current.state.sortObject).toMatchObject(acceptableSortObject);
  });
});
