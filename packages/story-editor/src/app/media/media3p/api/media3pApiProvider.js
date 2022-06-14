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
import { getResourceFromMedia3p } from '../../utils';
import { PROVIDERS } from '../providerConfiguration';
import apiFetcher from './apiFetcher';
import Context from './context';

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

  /**
   * Constructs the filter used for the listMedia requests.
   *
   * @param {Object} obj - An object with the options.
   * @param {string} obj.provider The provider to get the media from.
   * Currently only 'unsplash' is supported.
   * @param {?string} obj.contentType Optional. The content type to send.
   * @param {?string} obj.searchTerm Optional. Search term to send,
   * eg: 'cute cats'.
   * @param {?string} obj.categoryId Optional. Id of the selected
   * category.
   * @return {string} A filter string.
   */
  function constructFilter({ provider, contentType, searchTerm, categoryId }) {
    if (!Object.keys(PROVIDERS).includes(provider)) {
      throw new Error(`Unsupported provider: ${provider}`);
    }

    if (categoryId && searchTerm) {
      throw new Error(`searchTerm and categoryId are mutually exclusive.`);
    }
    return [
      `provider:${provider}`,
      contentType && `type:${contentType}`,
      categoryId && `category:${categoryId}`,
      searchTerm,
    ]
      .filter(Boolean)
      .join(' ');
  }

  /**
   * Get media for the given parameters.
   *
   * @typedef {Object} ListMediaFilter
   * @property {?string} contentType Optional. The content type to filter.
   * @property {?string} searchTerm Optional. The search term to send,
   * eg: 'cute cats'.
   * @property {?string} categoryId Optional. Id of the selected category.
   * @type {import('./typedefs').ListMediaFn}
   * @param {Object} obj - An object with the options.
   * @param {string} obj.provider The provider to get the media from.
   * @param {?ListMediaFilter} obj.filter Optional. The filter attributes.
   * @param {?string} obj.orderBy The desired ordering of the results.
   * Defaults to 'relevance' in the API.
   * @param {?string} obj.pageToken An optional page token to provide,
   * for pagination. If unspecified, the first page of results will be returned.
   * @return {Promise<{nextPageToken: *, media: *}>} An object with the media
   * resources and a next page token.
   */
  async function listMedia({ provider, filter, orderBy, pageToken }) {
    const { contentType, searchTerm, categoryId } = filter ?? {};

    const response = await apiFetcher.listMedia({
      filter: constructFilter({
        provider,
        contentType,
        searchTerm,
        categoryId,
      }),
      orderBy,
      pageSize: MEDIA_PAGE_SIZE,
      pageToken,
    });
    return {
      media: (response.media || []).map(getResourceFromMedia3p),
      nextPageToken: response.nextPageToken,
    };
  }

  /**
   * Get categories for the given parameters.
   *
   * @type {import('./typedefs').ListCategoriesFn}
   * @param {Object} obj - An object with the options.
   * @param {string} obj.provider The provider to get the media from.
   * @param {?string} obj.orderBy The desired ordering of the results.
   * Defaults to 'trending' in the API.
   * @return {Promise<{categories: *}>} An object with the category
   * resources.
   */
  async function listCategories({ provider, orderBy }) {
    const filter = constructFilter({ provider });
    const response = await apiFetcher.listCategories({
      filter,
      orderBy,
    });
    return {
      categories: response.categories.map((m) => ({
        id: m.name,
        label: m.displayName,
      })),
    };
  }

  /**
   * Register usage of a media for the given payload.
   *
   * @type {import('./typedefs').RegisterUsageFn}
   * @param {Object} obj - An object with the options.
   * @param {string} obj.registerUsageUrl The url to be called to register the
   * usage.
   * @return {Promise<void>}
   */
  async function registerUsage({ registerUsageUrl }) {
    await apiFetcher.registerUsage({ registerUsageUrl });
  }

  /**
   * @type {import('./typedefs').Media3pApiContext}
   */
  const contextValue = {
    actions: {
      listMedia,
      listCategories,
      registerUsage,
    },
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

Media3pApiProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Media3pApiProvider;
