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
import { __ } from '@wordpress/i18n';
import { ProviderType } from '../../../components/library/panes/media/common/providerType';
import { useSnackbar } from '../../snackbar';
import { useMedia3pApi } from './api';

function getFetchCategoriesErrorMessage(provider) {
  if (provider === ProviderType.UNSPLASH) {
    return __('Error loading categories from Unsplash', 'web-stories');
  }
  return __('Error loading categories', 'web-stories');
}

export default function useFetchCategoriesEffect({
  provider,
  selectedProvider,
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
        const { categories } = await listCategories({ provider });
        fetchCategoriesSuccess({ provider, categories });
      } catch {
        fetchCategoriesError({ provider });
        showSnackbar({ message: getFetchCategoriesErrorMessage(provider) });
      }
    }

    if (provider === selectedProvider) {
      fetch();
    }
  }, [
    showSnackbar,
    // Fetch categories is triggered by changes to these.
    selectedProvider,
    // These attributes never change.
    provider,
    listCategories,
    fetchCategoriesStart,
    fetchCategoriesSuccess,
    fetchCategoriesError,
  ]);
}
