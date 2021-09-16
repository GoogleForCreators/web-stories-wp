/*
 * Copyright 2020 Google LLC
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
import { useCallback, useMemo } from '@web-stories-wp/react';
import { addQueryArgs } from '@web-stories-wp/design-system';

export default function useSearchApi(dataAdapter, { searchApi, pagesApi }) {
  const getPageById = useCallback(
    async (id) => {
      try {
        const response = await dataAdapter.get(
          addQueryArgs(`${pagesApi}${id}/`, {
            _fields: 'title,link',
          })
        );

        return {
          title: response.title.rendered,
          link: response.link,
        };
      } catch (e) {
        return null;
      }
    },
    [dataAdapter, pagesApi]
  );

  const search = useCallback(
    async (searchTerm) => {
      try {
        const response = await dataAdapter.get(
          addQueryArgs(searchApi, {
            per_page: 100,
            search: searchTerm,
            type: 'post',
            subtype: 'page',
          })
        );

        return response.map(({ id, title }) => ({ value: id, label: title }));
      } catch (e) {
        return [];
      }
    },
    [dataAdapter, searchApi]
  );

  return useMemo(
    () => ({
      api: { search, getPageById },
    }),
    [search, getPageById]
  );
}
