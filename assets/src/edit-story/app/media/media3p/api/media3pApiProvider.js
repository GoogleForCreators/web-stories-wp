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
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import getResourceFromMedia3p from '../../utils/getResourceFromMedia3p';
import apiFetcher from './apiFetcher';
import Context from './context';

/**
 * The supported providers.
 *
 * @enum {string}
 */
const Providers = {
  UNSPLASH: 'unsplash',
};

/** @typedef {import('react').ProviderProps} ProviderProps */

/**
 * Provider for the Media3P API. Delegates fetching the data to apiFetcher,
 * but transforms the response into resources.
 *
 * @param {ProviderProps} Provider props.
 * @return {Object} Context.
 */
function Media3pApiProvider({ children }) {
  const MEDIA_PAGE_SIZE = 20;

  function constructFilter(
    provider,
    searchTerm,
    selectedCategoryId,
    mediaType
  ) {
    return [
      provider ? `provider:${provider}` : null,
      mediaType ? `type:${mediaType}` : null,
      selectedCategoryId ? `category_id:${selectedCategoryId}` : searchTerm,
    ]
      .filter(Boolean)
      .join(' ');
  }

  /**
   * Get media for the given parameters.
   *
   * @param {Object} obj - An object with the options.
   * @param {string} obj.provider The provider to get the media from.
   * Currently only 'unsplash' is supported.
   * @param {?string} obj.searchTerm Optional search term to send,
   * eg: 'cute cats'.
   * @param {?string} obj.selectedCategoryId Optional name of the selected
   * category. If present, a searchTerm is ignored.
   * @param {?string} obj.orderBy The desired ordering of the results.
   * Defaults to 'relevance' in the API.
   * @param {?string} obj.mediaType The media type of results to get.
   * Currently ignored by the API as Unsplash only handles images.
   * @param {?string} obj.pageToken An optional page token to provide,
   * for pagination. If unspecified, the first page of results will be returned.
   * @return {Promise<{nextPageToken: *, media: *}>} An object with the media
   * resources and a next page token.
   */
  async function listMedia({
    provider,
    searchTerm,
    selectedCategoryId,
    orderBy,
    mediaType,
    pageToken,
  }) {
    if (provider.toLowerCase() !== Providers.UNSPLASH) {
      throw new Error(`Unsupported provider: ${provider}`);
    }
    const filter = constructFilter(
      provider,
      searchTerm,
      selectedCategoryId,
      mediaType
    );
    const response = await apiFetcher.listMedia({
      filter,
      orderBy,
      pageSize: MEDIA_PAGE_SIZE,
      pageToken,
    });
    return {
      media: response.media.map(getResourceFromMedia3p),
      nextPageToken: response.nextPageToken,
    };
  }

  /**
   * Get categories for the given parameters.
   *
   * @param {Object} obj - An object with the options.
   * @param {string} obj.provider The provider to get the media from.
   * Currently only 'unsplash' is supported.
   * @param {?string} obj.orderBy The desired ordering of the results.
   * Defaults to 'trending' in the API.
   * @return {Promise<{categories: *}>} An object with the category
   * resources.
   */
  async function listCategories({ provider, orderBy }) {
    if (provider.toLowerCase() !== Providers.UNSPLASH) {
      throw new Error(`Unsupported provider: ${provider}`);
    }
    const filter = constructFilter(provider);
    const response = await apiFetcher.listCategories({
      filter,
      orderBy,
    });
    return {
      categories: response.categories.map((m) => ({
        id: m.name,
        displayName: m.displayName,
      })),
    };
  }

  const contextValue = {
    actions: {
      listMedia,
      listCategories,
    },
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

Media3pApiProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Media3pApiProvider;
