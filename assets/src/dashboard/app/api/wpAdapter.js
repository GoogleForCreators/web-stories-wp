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
import queryString from 'query-string';

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

const get = (path, options = {}) => apiFetch({ path, ...options });

const post = (path, options = {}) =>
  apiFetch({
    path,
    ...options,
    method: 'POST',
  });

// `apiFetch` by default turns `DELETE` requests into `POST` requests
// with `X-HTTP-Method-Override: DELETE` headers.
// However, some Web Application Firewall (WAF) solutions prevent this.
// `?_method=DELETE` is an alternative solution to override the request method.
// See https://developer.wordpress.org/rest-api/using-the-rest-api/global-parameters/#_method-or-x-http-method-override-header
const deleteRequest = (path, options = {}) =>
  apiFetch({
    path: queryString.stringifyUrl({
      url: path,
      query: {
        _method: 'DELETE',
      },
    }),
    ...options,
    method: 'POST',
  });

export default {
  get,
  post,
  deleteRequest,
};
