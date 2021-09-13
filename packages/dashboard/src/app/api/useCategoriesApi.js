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
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from '@web-stories-wp/react';
import { addQueryArgs } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import groupBy from '../../utils/groupBy';
import fetchAllFromTotalPages from './fetchAllFromPages';

export default function useCategoriesApi(dataAdapter, { categoryApi }) {
  const [categories, setCategories] = useState({});
  const fetchCategories = useCallback(async () => {
    try {
      const response = await dataAdapter.get(
        addQueryArgs(categoryApi, { per_page: 100 }),
        { parse: false }
      );

      const categoriesJson = await fetchAllFromTotalPages(
        response,
        dataAdapter,
        categoryApi
      );

      setCategories(
        groupBy(
          categoriesJson.map(({ _links, ...category }) => category),
          'id'
        )
      );
    } catch (e) {
      setCategories({});
    }
  }, [dataAdapter, categoryApi]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return useMemo(
    () => ({
      api: { fetchCategories },
      categories,
    }),
    [fetchCategories, categories]
  );
}
