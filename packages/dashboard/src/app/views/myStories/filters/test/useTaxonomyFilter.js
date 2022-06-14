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
import useTaxonomyFilters from '../taxonomy/useTaxonomyFilters';

jest.mock('../../../../api/useApi', () => {
  const getTaxonomies = (args) => {
    const taxonomies = [
      {
        slug: 'tax1',
        hierarchical: true,
        restBase: 'tax1_Base',
        restPath: 'tax1/path',
        labels: {
          filterByItem: 'Filter by tax1',
          allItems: 'All Tax1',
          searchItems: 'Search Tax1',
          notFound: 'No tax1s found',
        },
      },
      {
        slug: 'tax2',
        hierarchical: false,
        restBase: 'tax2_Base',
        restPath: 'tax2/path',
      },
      {
        slug: 'tax3',
        hierarchical: true,
        restBase: 'tax3_Base',
        restPath: 'tax3/path',
        labels: {
          filterByItem: 'Filter by tax3',
          allItems: 'All Tax3',
          searchItems: 'Search Tax3',
          notFound: 'No tax3s found',
        },
      },
    ];
    return Promise.resolve(
      args.hierarchical ? taxonomies.filter((t) => t.hierarchical) : taxonomies
    );
  };
  const getTaxonomyTerms = (restPath) =>
    restPath === 'tax1/path'
      ? Promise.resolve([{ taxonomy: 'tax1', name: 'termName' }])
      : Promise.resolve([]);
  return {
    __esModule: true,
    default: function useApi() {
      return {
        getTaxonomies,
        getTaxonomyTerms,
      };
    },
  };
});

describe('useTaxonomyFilters', () => {
  it('should initilize the hierarchial taxonomy filters data only', async () => {
    const { result } = renderHook(() => useTaxonomyFilters());
    // flush promise queue
    await act(() => Promise.resolve());
    // taxonomies should only be hierarchical
    expect(result.current.taxonomies).toHaveLength(2);
    // getTaxonomyTerms should append the parent taxonomy restBase and restPath
    const taxonomy = result.current.taxonomies.find((t) => t.slug === 'tax1');
    expect(taxonomy).toMatchObject({
      data: [
        {
          taxonomy: 'tax1',
          name: 'termName',
          restBase: 'tax1_Base',
          restPath: 'tax1/path',
        },
      ],
    });
  });

  describe('initializeTaxonomyFilters', () => {
    it('should initilize taxonomy filters data', async () => {
      const { result } = renderHook(() => useTaxonomyFilters());
      // flush promise queue
      await act(() => Promise.resolve());

      // initialize filters
      act(() => {
        const filters = result.current.initializeTaxonomyFilters();
        expect(filters).toHaveLength(2);

        const filter1 = filters.at(0);
        expect(filter1.placeholder).toBe('All Tax1');
        expect(filter1.ariaLabel).toBe(`Filter by tax1`);
        expect(filter1.noMatchesFoundLabel).toBe('No tax1s found');
        expect(filter1.searchPlaceholder).toBe('Search Tax1');
      });
    });
  });
});
