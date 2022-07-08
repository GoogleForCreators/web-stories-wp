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
import TemplateFiltersProvider from '../TemplateFiltersProvider';
import { TEMPLATE_SORT_KEYS } from '../../../../../constants/templates';
import useTemplateFilters from '../useTemplateFilters';

describe('provider', () => {
  it('should register filters and update filters', () => {
    const wrapper = ({ children }) => (
      <TemplateFiltersProvider>{children}</TemplateFiltersProvider>
    );

    const { result } = renderHook(() => useTemplateFilters(), { wrapper });
    const filterKey = 'color';

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
    let filterObj = result.current.state.filtersObject;

    expect(filter).toBeDefined();
    expect(filter.filterId).toBeNull();

    // filters with falsy filterId's should not be in the filters object
    expect(filterObj).toMatchObject({});

    // update the filter
    act(() => {
      result.current.actions.updateFilter(filterKey, {
        filterId: 1,
      });
    });

    filter = result.current.state.filters.find((f) => f.key === filterKey);
    filterObj = result.current.state.filtersObject;

    expect(filter).toMatchObject({
      filterId: 1,
    });
    expect(filterObj).toMatchObject({
      [filterKey]: 1,
    });

    // should unset filterId if the current filterId is given
    act(() => {
      result.current.actions.updateFilter(filterKey, {
        filterId: 1,
      });
    });
    filter = result.current.state.filters.find((f) => f.key === filterKey);
    filterObj = result.current.state.filtersObject;
    expect(filter).toMatchObject({
      filterId: null,
    });
    expect(filterObj[filterKey]).toBeUndefined();
  });

  it('should not unset "search" and "status" if the same filterId is given', () => {
    const wrapper = ({ children }) => (
      <TemplateFiltersProvider>{children}</TemplateFiltersProvider>
    );

    const { result } = renderHook(() => useTemplateFilters(), { wrapper });

    // register search and status filter
    act(() => {
      result.current.actions.registerFilters([
        { key: 'search' },
        { key: 'status' },
      ]);
    });
    let searchFilter = result.current.state.filters.find(
      ({ key }) => key === 'search'
    );
    let statusFilter = result.current.state.filters.find(
      ({ key }) => key === 'status'
    );
    expect(searchFilter).toBeDefined();
    expect(statusFilter).toBeDefined();

    // update the 'search' filter
    act(() => {
      result.current.actions.updateFilter('search', { filterId: 'Blue' });
    });

    // update the 'search' filter with the same current 'filterId'
    act(() => {
      result.current.actions.updateFilter('search', { filterId: 'Blue' });
    });

    searchFilter = result.current.state.filters.find(
      ({ key }) => key === 'search'
    );
    expect(searchFilter.filterId).toBe('Blue');

    // update the 'status' filter
    act(() => {
      result.current.actions.updateFilter('status', { filterId: 'New' });
    });

    // update the 'status' filter with the same current 'filterId'
    act(() => {
      result.current.actions.updateFilter('status', { filterId: 'New' });
    });

    statusFilter = result.current.state.filters.find(
      ({ key }) => key === 'status'
    );
    expect(statusFilter.filterId).toBe('New');
  });

  it('should be able to update the sortObject if the acceptable keys are use', () => {
    const wrapper = ({ children }) => (
      <TemplateFiltersProvider>{children}</TemplateFiltersProvider>
    );

    const { result } = renderHook(() => useTemplateFilters(), { wrapper });

    for (const key of Object.keys(TEMPLATE_SORT_KEYS)) {
      for (const value of Object.values(TEMPLATE_SORT_KEYS[key])) {
        act(() => {
          result.current.actions.updateSort({ [key]: value });
        });
        expect(result.current.state.sortObject).toMatchObject({ [key]: value });
      }
    }
  });

  it('should not be able to update the sortObject with arbitrary key value pairs', () => {
    const wrapper = ({ children }) => (
      <TemplateFiltersProvider>{children}</TemplateFiltersProvider>
    );

    const { result } = renderHook(() => useTemplateFilters(), { wrapper });

    const unacceptableSortValues = {
      orderby: 'valueNotInSortKeyOrderby',
      order: 'up',
    };

    const unacceptableSortKeys = {
      sortby: 'popular',
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
      <TemplateFiltersProvider>{children}</TemplateFiltersProvider>
    );

    const { result } = renderHook(() => useTemplateFilters(), { wrapper });

    const acceptableSortObject = {
      orderby: 'popular',
      order: 'asc',
    };

    const unacceptableSortKeys = {
      sortby: 'popular',
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
