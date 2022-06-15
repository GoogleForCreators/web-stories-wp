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
import {
  useCallback,
  useEffect,
  useState,
  useMemo,
} from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import useApi from '../../../../api/useApi';

function useAuthorFilter() {
  const [authors, setAuthors] = useState([]);

  const { getAuthors } = useApi(
    ({
      actions: {
        usersApi: { getAuthors },
      },
    }) => ({
      getAuthors,
    })
  );

  const queryAuthors = useCallback(
    async (filter, search) => {
      const data = await getAuthors(search);

      const userData = data.map(({ id, name }) => ({
        id,
        name,
      }));
      return userData;
    },
    [getAuthors]
  );

  const _setAuthors = useCallback(async () => {
    const data = await queryAuthors();
    setAuthors(data);
  }, [setAuthors, queryAuthors]);

  const initializeAutherFilter = useCallback(() => {
    return {
      key: 'author',
      query: queryAuthors,
      primaryOptions: authors,
      ariaLabel: __('Filter stories by author', 'web-stories'),
      placeholder: __('All Authors', 'web-stories'),
      searchPlaceholder: __('Search authors', 'web-stories'),
      noMatchesFoundLabel: __('No authors found', 'web-stories'),
    };
  }, [queryAuthors, authors]);

  useEffect(() => {
    _setAuthors();
  }, [_setAuthors]);

  return useMemo(() => ({ initializeAutherFilter }), [initializeAutherFilter]);
}

export default useAuthorFilter;
