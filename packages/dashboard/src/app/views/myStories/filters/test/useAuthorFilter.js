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
import useAuthorFilter from '../author/useAuthorFilter';

jest.mock('../../../../api/useApi', () => {
  const getAuthors = () => {
    return Promise.resolve([
      {
        id: 1,
        name: 'admin',
      },
    ]);
  };
  return {
    __esModule: true,
    default: function useApi() {
      return {
        getAuthors,
      };
    },
  };
});

describe('useAuthorFilter', () => {
  it('should set authors to return value of getAuthors', async () => {
    const { result } = renderHook(() => useAuthorFilter());
    // flush promise queue
    await act(() => Promise.resolve());

    expect(result.current.authors).toHaveLength(1);
  });

  describe('initializeAuthorFilter', () => {
    it('should initilize author filter data', async () => {
      const { result } = renderHook(() => useAuthorFilter());
      // flush promise queue
      await act(() => Promise.resolve());

      // initialize filter
      act(() => {
        const authorFilter = result.current.initializeAuthorFilter();
        expect(authorFilter.primaryOptions).toHaveLength(1);
        expect(authorFilter.primaryOptions[0]).toMatchObject({
          id: 1,
          name: 'admin',
        });

        expect(authorFilter.placeholder).toBe('All Authors');
        expect(authorFilter.ariaLabel).toBe(`Filter stories by author`);
        expect(authorFilter.noMatchesFoundLabel).toBe('No authors found');
        expect(authorFilter.searchPlaceholder).toBe('Search authors');
      });
    });
  });
});
