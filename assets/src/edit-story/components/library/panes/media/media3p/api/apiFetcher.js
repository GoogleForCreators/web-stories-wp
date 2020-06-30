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

const API_DOMAIN = 'https://staging-media3p.sandbox.googleapis.com';
const API_KEY = 'AIzaSyAgauA-izuTeGWFe9d9O0d0id-pV43Y4kE'; // dev key

/**
 * The methods exposed by the api
 *
 * @enum {string}
 */
const Paths = {
  LIST_MEDIA: '/v1/media',
};

/**
 * The supported order_by values.
 *
 * @enum {string}
 */
const OrderBy = {
  RELEVANCE: 'relevance',
  LATEST: 'latest',
};

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
export async function listMedia({
  languageCode = null,
  filter = null,
  orderBy = null,
  pageSize = null,
  pageToken = null,
} = {}) {
  validateOrderBy(orderBy);
  validatePageSize(pageSize);

  const params = [
    ['language_code', languageCode],
    ['filter', filter],
    ['order_by', orderBy],
    ['page_size', pageSize],
    ['page_token', pageToken],
    ['key', API_KEY],
  ].filter((entry) => Boolean(entry[1]));
  // Querystring always has at least the api key
  const queryString = new URLSearchParams(Object.fromEntries(new Map(params)));
  const url = API_DOMAIN + Paths.LIST_MEDIA + '?' + queryString.toString();

  const response = await window.fetch(url);

  if (!response.ok) {
    throw new Error(
      'Obtained an error from the listMedia call, statusCode: ' +
        response.status +
        ', statusText: ' +
        response.statusText
    );
  }

  return response.json();
}

function validateOrderBy(orderBy) {
  if (
    orderBy == null ||
    Object.values(OrderBy).indexOf(orderBy.toLowerCase()) > -1
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
