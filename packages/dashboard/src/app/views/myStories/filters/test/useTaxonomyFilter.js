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
  const getTaxonomies = () =>
    Promise.resolve([
      {
        slug: 'tax1',
        hierarchical: true,
        restBase: 'tax1_Base',
        restPath: 'tax1/path',
        labels: {},
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
          name: 'tax3',
        },
      },
      {
        slug: 'tax4',
        hierarchical: true,
        restBase: 'tax4_Base',
        restPath: 'tax4/path',
        labels: {
          singularName: 'tax4',
          allItems: 'All Tax4',
          searchItems: 'Search Tax4',
        },
      },
    ]);
  const getTaxonomyTerm = (restPath) =>
    restPath === 'tax1/path'
      ? Promise.resolve([{ taxonomy: 'tax1', name: 'termName' }])
      : Promise.resolve([]);
  return {
    __esModule: true,
    default: function useApi() {
      return {
        getTaxonomies,
        getTaxonomyTerm,
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
    expect(result.current.taxonomies).toHaveLength(3);
    // getTaxonomyTerm should append the parent taxonomy restBase and restPath
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
      const t1 = result.current.taxonomies.find((t) => t.slug === 'tax1');
      const t3 = result.current.taxonomies.find((t) => t.slug === 'tax3');
      const t4 = result.current.taxonomies.find((t) => t.slug === 'tax4');
      act(() => {
        const filters = result.current.initializeTaxonomyFilters();
        expect(filters).toHaveLength(3);

        // Base case, no labels given
        const filter1 = filters.at(0);
        expect(filter1.placeholder).toBe(t1.restBase);
        expect(filter1.ariaLabel).toBe(`Filter stories by ${t1.restBase}`);
        expect(filter1.searchResultsLabel).toBe('Search Taxonomy');

        // Only name is given
        const filter3 = filters.at(1);
        expect(filter3.placeholder).toBe(t3.labels.name);
        expect(filter3.ariaLabel).toBe(`Filter stories by ${t3.labels.name}`);
        expect(filter3.searchResultsLabel).toBe(`Search ${t3.labels.name}`);

        // All necessary labels given
        const filter4 = filters.at(2);
        expect(filter4.placeholder).toBe(t4.labels.allItems);
        expect(filter4.ariaLabel).toBe(
          `Filter stories by ${t4.labels.singularName}`
        );
        expect(filter4.searchResultsLabel).toBe(t4.labels.searchItems);
      });
    });
  });
});
