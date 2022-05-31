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
import useTaxonomyFilter from '../taxonomy/useTaxonomyFilter';

jest.mock('../../../../api/useApi', () => ({
  __esModule: true,
  default: function useApi() {
    return {
      getTaxonomies: () => Promise.resolve([]),
      getTaxonomyTerm: () => Promise.resolve([]),
    };
  },
}));

// seems like Im testing the useTaxonomyFilter hook here not the Provider
describe('provider', () => {
  it('should pass', () => {
    const wrapper = ({ children }) => (
      <FiltersProvider>{children}</FiltersProvider>
    );
    const { result } = renderHook(() => useTaxonomyFilter(), { wrapper });

    act(async () => {
      await result.current.queryTaxonomies();
      expect(result.current.queriedTaxonomies).toBe([]);
    });

    expect(true).toBeTruthy();
  });
});
