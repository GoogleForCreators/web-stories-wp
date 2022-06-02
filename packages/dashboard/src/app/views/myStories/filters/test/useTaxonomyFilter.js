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
      },
      {
        slug: 'tax2',
        hierarchical: false,
        restBase: 'tax2_Base',
        restPath: 'tax2/path',
      },
    ]);
  const getTaxonomyTerm = () => Promise.resolve([{ taxonomy: 'tax1' }]);
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
  it('should initilize the hierarchial taxonomy filters data', async () => {
    const { result } = renderHook(() => useTaxonomyFilters());
    // flush promise queue
    await act(() => Promise.resolve());
    // taxonomies should only be hierarchical
    expect(result.current.taxonomies).toHaveLength(1);
    // getTaxonomyTerm should append the parent taxonomy restBase and restPath
    expect(result.current.taxonomies.at(0)).toMatchObject({
      data: [
        {
          taxonomy: 'tax1',
          restBase: 'tax1_Base',
          restPath: 'tax1/path',
        },
      ],
    });
  });
});
