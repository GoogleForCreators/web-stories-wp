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

export const API_DOMAIN = 'https://media3p.googleapis.com';
const API_KEY = 'AIzaSyDqgPsZ0VnxAuakmX7bjnzmNQsE7Drlvk0';

/**
 * The methods exposed by the api
 *
 * @enum {string}
 */
export const Paths = {
  LIST_MEDIA: '/v1/media',
  LIST_CATEGORIES: '/v1/categories',
  REGISTER_USAGE: '/v1/media:registerUsage',
};

/**
 * The supported order_by values for {@link listMedia}.
 *
 * @enum {string}
 */
const ListMediaOrderBy = {
  RELEVANCE: 'relevance',
  LATEST: 'latest',
};

/**
 * The supported order_by values for {@link listCategories}.
 *
 * @enum {string}
 */
const CategoriesOrderBy = {
  TRENDING: 'trending',
};

function validateListMediaOrderBy(orderBy) {
  validateOrderBy(ListMediaOrderBy, orderBy);
}

function validateCategoriesOrderBy(orderBy) {
  validateOrderBy(CategoriesOrderBy, orderBy);
}

function validateOrderBy(allowedOrderByValues, orderBy) {
  if (
    orderBy == null ||
    Object.values(allowedOrderByValues).indexOf(orderBy.toLowerCase()) > -1
  ) {
    return;
  }
  throw new Error('Invalid order_by: ' + orderBy);
}

function validatePageSize(pageSize) {
  if (pageSize == null || pageSize > 0) {
    return;
  }
  throw new Error('Invalid page_size: ' + pageSize);
}

function validateRegisterUsageUrl(url) {
  if (url && url.includes(Paths.REGISTER_USAGE)) {
    return;
  }
  throw new Error('Invalid url: ' + url);
}

class ApiFetcher {
  /**
   * Perform a GET request to the Media3P API to list media.
   * If the parameters are invalid or the server does not return a 200 response,
   * an error is thrown.
   *
   * @param {Object} obj - An object with the options for the request.
   * @param {?string} obj.languageCode The BCP-47 language code, such as "en-US"
   * or "sr-Latn".
   * @param {?string} obj.filter  Filter details for items returned.
   * Filter fields available:
   * > provider - The media provider to query, or a universal list/search if
   * left blank.
   * > type - The media type, either 'image' or 'video'.
   * > query - A keyword search string.
   * This may be specified without the 'query:' prefix.
   * @param {?string} obj.orderBy The sort order for returned results.
   * Valid sort fields are:
   * > relevance - The default. This is 'most popular' when listing results,
   * and 'most relevant' when applying a keyword search.
   * > latest - Last updated time descending.
   * @param {?number} obj.pageSize Maximum number of results to be returned by the
   * server. If unspecified or zero, at most 20 media resources will be returned.
   * @param {?string} obj.pageToken A page token, received from a previous
   * `ListMedia` call. Provide this to retrieve the subsequent page.
   * When paginating, all other parameters provided to `ListMedia` must match
   * the call that provided the page token.
   * @return {Promise<Object>} The response from the API.
   */
  async listMedia({
    languageCode = null,
    filter = null,
    orderBy = null,
    pageSize = null,
    pageToken = null,
  } = {}) {
    validateListMediaOrderBy(orderBy);
    validatePageSize(pageSize);

    const params = new URLSearchParams(
      [
        ['language_code', languageCode],
        ['filter', filter],
        ['order_by', orderBy],
        ['page_size', pageSize],
        ['page_token', pageToken],
      ].filter((entry) => Boolean(entry[1]))
    );

    // eslint-disable-next-line no-return-await
    return await this.fetchPath({ params, path: Paths.LIST_MEDIA });
  }

  /**
   * Perform a GET request to the Media3P API to list categories.
   * If the parameters are invalid or the server does not return a 200 response,
   * an error is thrown.
   *
   * @param {Object} obj - An object with the options for the request.
   * @param {?string} obj.filter  Filter details for items returned.
   * Filter fields available:
   * > provider - The media provider to query, or a universal list/search if
   * left blank.
   * @param {?string} obj.orderBy The sort order for returned results.
   * Valid sort fields are:
   * > 'trending' - The default. This is the categories that are trending now.
   * @param {?number} obj.pageSize Maximum number of results to be returned by the
   * server. If unspecified or zero, at most 20 media resources will be returned.
   * @return {Promise<Object>} The response from the API.
   */
  async listCategories({
    filter = null,
    orderBy = null,
    pageSize = null,
  } = {}) {
    validateCategoriesOrderBy(orderBy);
    validatePageSize(pageSize);

    const params = new URLSearchParams(
      [
        ['filter', filter],
        ['order_by', orderBy],
        ['page_size', pageSize],
      ].filter((entry) => Boolean(entry[1]))
    );

    // eslint-disable-next-line no-return-await
    return await this.fetchPath({
      params,
      path: Paths.LIST_CATEGORIES,
    });
  }

  /**
   * Perform a POST request to the Media3P API to register a usage.
   * If the parameters are invalid or the server does not return a 200 response,
   * an error is thrown.
   *
   * @param {Object} obj - An object with the options for the request.
   * @param {string} obj.registerUsageUrl Url to call to register media usage.
   * @return {Promise<undefined>} The response from the API.
   */
  async registerUsage({ registerUsageUrl }) {
    validateRegisterUsageUrl(registerUsageUrl);

    // eslint-disable-next-line no-return-await
    return await this.fetchUrl({
      url: new URL(registerUsageUrl),
      method: 'POST',
    }).then(() => undefined);
  }

  /**
   * Perform an HTTP request for the given params.
   *
   * @param {Object} obj - An object with the options for the request.
   * @param {Paths} obj.path Url to be called.
   * @param {URLSearchParams} obj.params Url to be called.
   * @param {?string} obj.method A string to set request's method.
   * @return {Promise<Object>} The response from the API.
   */
  async fetchPath({ path, params, method }) {
    const url = new URL(API_DOMAIN + path);
    params.forEach((value, key) => {
      url.searchParams.append(key, value);
    });
    // eslint-disable-next-line no-return-await
    return await this.fetchUrl({ url, method });
  }

  /**
   * Perform an HTTP request for the given params.
   *
   * @param {Object} obj - An object with the options for the request.
   * @param {URL} obj.url Url to be called.
   * @param {?string} obj.method A string to set request's method.
   * @return {Promise<Object>} The response from the API.
   */
  async fetchUrl({ url, method }) {
    url.searchParams.append('key', API_KEY);
    const response = await window.fetch(url.href, {
      method: method ?? 'GET',
    });
    if (!response.ok) {
      throw new Error(
        'Obtained an error from the ' +
          url.pathname +
          ' call, statusCode: ' +
          response.status +
          ', statusText: ' +
          response.statusText
      );
    }
    return response.json();
  }
}

export default new ApiFetcher();
