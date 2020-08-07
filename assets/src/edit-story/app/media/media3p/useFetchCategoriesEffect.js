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
import { useEffect } from 'react';

/**
 * Internal dependencies
 */
/**
 * WordPress dependencies
 */
import { useSnackbar } from '../../snackbar';
import { useMedia3pApi } from './api';
import { PROVIDERS } from './providerConfiguration';

export default function useFetchCategoriesEffect({
  provider,
  selectedProvider,
  categories,
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesError,
}) {
  const {
    actions: { listCategories },
  } = useMedia3pApi();

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    async function fetch() {
      fetchCategoriesStart({ provider });
      try {
        const { categories: newCategories } = await listCategories({
          provider,
        });
        fetchCategoriesSuccess({ provider, categories: newCategories });
      } catch (e) {
        fetchCategoriesError({ provider });
        showSnackbar({
          message: PROVIDERS[provider].fetchCategoriesErrorMessage,
        });
      }
    }

    if (
      provider === selectedProvider &&
      PROVIDERS[provider].supportsCategories &&
      !categories?.length
    ) {
      fetch();
    }
  }, [
    showSnackbar,
    // Fetch categories is triggered by changes to these.
    selectedProvider,
    categories,
    // These attributes never change.
    provider,
    listCategories,
    fetchCategoriesStart,
    fetchCategoriesSuccess,
    fetchCategoriesError,
  ]);
}
