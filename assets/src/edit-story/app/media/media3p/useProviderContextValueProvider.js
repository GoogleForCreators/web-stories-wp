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
import { useCallback } from 'react';

/**
 * Internal dependencies
 */
import useFetchMediaEffect from './useFetchMediaEffect';
import useFetchCategoriesEffect from './useFetchCategoriesEffect';

/**
 * @typedef {import('./typedefs').Media3pReducerState} Media3pReducerState
 * @typedef {import('./typedefs').Media3pReducerActions} Media3pReducerActions
 * @typedef {import('./typedefs').Media3pProviderContext} Media3pProviderContext
 */

/**
 * Context fragment provider for a single 3p media source (Unsplash, Coverr,
 * etc).
 *
 * @param {string} provider The 3p provider to return the context value for
 * @param {Media3pReducerState} reducerState
 * The 'media3p/[provider]' fragment of the state returned from
 * `useMediaReducer`
 * @param {Media3pReducerActions} reducerActions
 * The 'media3p/[provider]' fragment of the actions returned from
 * `useMediaReducer`
 * @return {Media3pProviderContext} Context.
 */
export default function useProviderContextValueProvider(
  provider,
  reducerState,
  reducerActions
) {
  const { selectedProvider, searchTerm } = reducerState;
  const {
    pageToken,
    isMediaLoading,
    isMediaLoaded,
    categories: { categories, selectedCategoryId },
  } = reducerState[provider];
  const {
    fetchMediaStart,
    fetchMediaSuccess,
    fetchMediaError,
    fetchCategoriesStart,
    fetchCategoriesSuccess,
    fetchCategoriesError,
  } = reducerActions;

  // Fetch or re-fetch media when the state has changed.
  useFetchMediaEffect({
    provider,
    selectedProvider,
    pageToken,
    isMediaLoading,
    isMediaLoaded,
    searchTerm,
    selectedCategoryId,
    fetchMediaStart,
    fetchMediaSuccess,
    fetchMediaError,
  });

  useFetchCategoriesEffect({
    provider,
    selectedProvider,
    categories,
    fetchCategoriesStart,
    fetchCategoriesSuccess,
    fetchCategoriesError,
  });

  return {
    state: reducerState[provider],
    actions: {
      setNextPage: useCallback(() => reducerActions.setNextPage({ provider }), [
        reducerActions,
        provider,
      ]),
      selectCategory: useCallback(
        (categoryId) => reducerActions.selectCategory({ provider, categoryId }),
        [reducerActions, provider]
      ),
      deselectCategory: useCallback(
        () => reducerActions.deselectCategory({ provider }),
        [reducerActions, provider]
      ),
    },
  };
}
