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
import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Internal dependencies
 */
import queryString from 'query-string';
import groupBy from '../../utils/groupBy';
import fetchAllFromTotalPages from './fetchAllFromPages';

export default function useTagsApi(dataAdapter, { tagsApi }) {
  const [tags, setTags] = useState({});
  const fetchTags = useCallback(async () => {
    try {
      const response = await dataAdapter.get(
        queryString.stringifyUrl({
          url: tagsApi,
          query: { per_page: 100 },
        }),
        {
          parse: false,
        }
      );

      const tagsJson = await fetchAllFromTotalPages(
        response,
        dataAdapter,
        tagsApi
      );

      setTags(
        groupBy(
          tagsJson.map(({ _links, ...tag }) => tag),
          'id'
        )
      );
    } catch (e) {
      setTags({});
    }
  }, [dataAdapter, tagsApi]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return useMemo(
    () => ({
      api: { fetchTags },
      tags,
    }),
    [fetchTags, tags]
  );
}
