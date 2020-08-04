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
import { useSnackbar } from '../../snackbar';
import { ProviderType } from '../../../components/library/panes/media/common/providerType';
import { useMedia3pApi } from './api';

function getFetchMediaErrorMessage(provider) {
  if (provider === ProviderType.UNSPLASH) {
    return __('Error loading media from Unsplash', 'web-stories');
  } else if (provider === ProviderType.LOCAL) {
    return __('Error loading media from Wordpress', 'web-stories');
  }
  return __('Error loading media', 'web-stories');
}

export default function useFetchMediaEffect({
  provider,
  selectedProvider,
  searchTerm,
  selectedCategoryId,
  pageToken,
  fetchMediaStart,
  fetchMediaSuccess,
  fetchMediaError,
}) {
  const {
    actions: { listMedia, listCategoryMedia },
  } = useMedia3pApi();

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    async function fetch() {
      fetchMediaStart({ provider, pageToken });
      try {
        let media, nextPageToken;
        if (selectedCategoryId) {
          ({ media, nextPageToken } = await listCategoryMedia({
            provider,
            selectedCategoryId,
            pageToken,
          }));
        } else {
          ({ media, nextPageToken } = await listMedia({
            provider,
            searchTerm,
            pageToken,
          }));
        }
        fetchMediaSuccess({ provider, media, pageToken, nextPageToken });
      } catch {
        fetchMediaError({ provider, pageToken });
        showSnackbar({ message: getFetchMediaErrorMessage(provider) });
      }
    }

    if (provider === selectedProvider) {
      fetch();
    }
  }, [
    showSnackbar,
    // Fetch media is triggered by changes to these.
    selectedProvider,
    pageToken,
    searchTerm,
    selectedCategoryId,
    // These attributes never change.
    provider,
    listMedia,
    listCategoryMedia,
    fetchMediaError,
    fetchMediaStart,
    fetchMediaSuccess,
  ]);
}
