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
import { renderHook, act } from '@testing-library/react';

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
      args.hierarchical
        ? taxonomies.filter((taxonomy) => taxonomy.hierarchical)
        : taxonomies
    );
  };
  const getTaxonomyTerms = (restPath, args) => {
    const fakeAPI = {
      'tax1/path': [{ id: 1, name: 'tax1_term1' }],
      'tax3/path': [
        { id: 3, name: 'tax3_term1' },
        { id: 4, name: 'tax3_term2' },
      ],
    };
    let terms = fakeAPI[restPath];
    if (args.search) {
      terms = terms.filter((term) => term.name.includes(args.search));
    }

    return Promise.resolve(terms);
  };
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
    const {
      result: { current: initializeTaxonomyFilters },
    } = renderHook(() => useTaxonomyFilters());
    // flush promise queue
    await act(() => Promise.resolve());

    // taxonomy filters should only be hierarchical
    const filters = await initializeTaxonomyFilters();
    expect(filters).toHaveLength(2);

    // should correctly set restPath
    const filter3 = filters.find((f) => f.key === 'tax3_Base');
    expect(filter3).toMatchObject({
      restPath: 'tax3/path',
    });

    const filter1 = filters.find((f) => f.key === 'tax1_Base');
    expect(filter1).toMatchObject({
      restPath: 'tax1/path',
    });
  });

  describe('initializeTaxonomyFilters', () => {
    let initailize;
    beforeEach(async () => {
      const {
        result: { current: initializeTaxonomyFilters },
      } = renderHook(() => useTaxonomyFilters());

      initailize = initializeTaxonomyFilters;

      // flush promise queue
      await act(() => Promise.resolve());
    });

    it('should initilize taxonomy filters data', async () => {
      // initialize filters
      const filters = await initailize();
      expect(filters).toHaveLength(2);

      const filter1 = filters.at(0);
      expect(filter1.placeholder).toBe('All Tax1');
      expect(filter1.ariaLabel).toBe(`Filter by tax1`);
      expect(filter1.noMatchesFoundLabel).toBe('No tax1s found');
      expect(filter1.searchPlaceholder).toBe('Search Tax1');
    });

    it('should use the correct taxonomy for getPrimaryOptions and query', async () => {
      const filters = await initailize();
      const filter1 = filters.at(0);
      const filter2 = filters.at(1);

      // should call getPrimaryOptions with tax1 taxonomy
      const primaryOptions1 = await filter1.getPrimaryOptions.call();
      expect(primaryOptions1).toStrictEqual([
        {
          id: 1,
          name: 'tax1_term1',
          restBase: 'tax1_Base',
          restPath: 'tax1/path',
        },
      ]);
      // should call query with tax1 taxonomy and search term
      const query1 = await filter1.query('m1');
      expect(query1).toStrictEqual([
        {
          id: 1,
          name: 'tax1_term1',
          restBase: 'tax1_Base',
          restPath: 'tax1/path',
        },
      ]);

      // should call getPrimaryOptions with tax3 taxonomy
      const primaryOptions2 = await filter2.getPrimaryOptions.call();
      expect(primaryOptions2).toStrictEqual([
        {
          id: 3,
          name: 'tax3_term1',
          restBase: 'tax3_Base',
          restPath: 'tax3/path',
        },
        {
          id: 4,
          name: 'tax3_term2',
          restBase: 'tax3_Base',
          restPath: 'tax3/path',
        },
      ]);

      // should call query with tax3 taxonomy and search term
      const query2 = await filter2.query('m1');
      expect(query2).toStrictEqual([
        {
          id: 3,
          name: 'tax3_term1',
          restBase: 'tax3_Base',
          restPath: 'tax3/path',
        },
      ]);
    });
  });
});
