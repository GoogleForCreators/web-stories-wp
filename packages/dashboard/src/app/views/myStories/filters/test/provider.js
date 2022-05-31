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

jest.mock('../taxonomy/useTaxonomyFilter', () => ({
  __esModule: true,
  default: function useTaxonomyFilter() {
    const react = jest.requireActual('react');
    const [primaryOptions] = react.useState([]);
    const [queriedOptions] = react.useState([]);
    return {
      query: () => Promise.resolve([]),
      primaryOptions,
      queriedOptions,
    };
  },
}));

describe('provider', () => {
  it('should pass', () => {
    const wrapper = ({ children }) => (
      <FiltersProvider>{children}</FiltersProvider>
    );

    const { result } = renderHook(() => useFilters(), { wrapper });

    act(() => {
      result.current.actions.updateFilter('taxonomy', {
        filterId: 1,
        filterSlug: 'web_story_category',
      });
    });

    expect(result.current.state.taxonomy).toMatchObject({
      filterId: 1,
      filterSlug: 'web_story_category',
    });
  });
});
