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
import { useEffect, useRef } from 'react';

/**
 * Internal dependencies
 */
/**
 * WordPress dependencies
 */
import { useSnackbar } from '../../snackbar';
import { useMedia3pApi } from './api';
import { PROVIDERS } from './providerConfiguration';

/**
 *
 * @param {{
 * provider: string,
 * selectedProvider: string,
 * searchTerm: string,
 * selectedCategoryId: string,
 * pageToken: string,
 * isMediaLoading: boolean,
 * isMediaLoaded: boolean,
 * fetchMediaStart: import('./typedefs').FetchMediaStart
 * fetchMediaSuccess: import('./typedefs').FetchMediaSuccess
 * fetchMediaError: import('./typedefs').FetchMediaError
 * }} param0 required actions and parameters
 */
export default function useFetchMediaEffect({
  provider,
  selectedProvider,
  searchTerm,
  selectedCategoryId,
  pageToken,
  isMediaLoading,
  isMediaLoaded,
  fetchMediaStart,
  fetchMediaSuccess,
  fetchMediaError,
}) {
  const {
    actions: { listMedia, listCategoryMedia },
  } = useMedia3pApi();

  const { showSnackbar } = useSnackbar();

  const previousPropsRef = useRef();

  useEffect(() => {
    // Previous props are read from current, and stored to current after that.
    // This allows us to get the previous values and compare for changes.
    const previousProps = previousPropsRef.current;
    previousPropsRef.current = {
      pageToken,
      searchTerm,
      selectedCategoryId,
      isMediaLoading,
      isMediaLoaded,
    };

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
        fetchMediaSuccess({
          provider,
          media,
          pageToken,
          nextPageToken,
        });
      } catch (e) {
        fetchMediaError({ provider, pageToken });
        showSnackbar({ message: PROVIDERS[provider].fetchMediaErrorMessage });
      }
    }

    // If we switched provider tab, and we already had loaded a page there, we
    // don't load media again.
    const somethingChanged =
      previousProps &&
      (pageToken != previousProps.pageToken ||
        searchTerm != previousProps.searchTerm ||
        selectedCategoryId != previousProps.selectedCategoryId);
    const firstFetchOrSomethingChanged =
      !previousProps ||
      (!previousProps.isMediaLoading && !previousProps.isMediaLoaded) ||
      somethingChanged;

    if (provider === selectedProvider && firstFetchOrSomethingChanged) {
      fetch();
    }
    // We don't want to depend on previousProps, see https://blog.logrocket.com/how-to-get-previous-props-state-with-react-hooks/
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    showSnackbar,
    previousPropsRef,
  ]);
}
