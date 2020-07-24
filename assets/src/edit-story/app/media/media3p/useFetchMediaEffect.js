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
import { useMedia3pApi } from './api';

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
      }
    }

    if (provider === selectedProvider) {
      fetch();
    }
  }, [
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
