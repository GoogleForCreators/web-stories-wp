/*
 * Copyright 2021 Google LLC
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
 * WordPress dependencies
 */
import { useCallback, useMemo, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import { STORIES_PER_REQUEST } from '../constants';

export default function useUserApi({ usersApi }) {
  const [authorSuggestions, setAuthorSuggestions] = useState([]);

  const fetchAuthors = useCallback(
    async ({ searchTerm, page = 1, perPage = STORIES_PER_REQUEST }) => {
      const query = {
        context: 'edit',
        search: searchTerm || undefined,
        page,
        per_page: perPage,
      };

      try {
        setAuthorSuggestions(
          await apiFetch({
            path: addQueryArgs(usersApi, query),
          })
        );
      } catch (e) {
        setAuthorSuggestions([]);
      }
    },
    [usersApi]
  );

  return useMemo(
    () => ({
      api: { fetchAuthors },
      authorSuggestions: authorSuggestions,
    }),
    [fetchAuthors, authorSuggestions]
  );
}
