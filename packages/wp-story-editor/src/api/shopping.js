/*
 * Copyright 2022 Google LLC
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
import { addQueryArgs } from '@googleforcreators/url';

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Get products
 *
 * @param {Object} config Configuration object.
 * @param {string} search Search term.
 * @param {string} orderby Order collection by product attribute.
 * @param {string} order Sort attribute ascending or descending.
 * @return {Promise} The response from the API.
 */
export function getProducts(config, search, orderby, order) {
  return apiFetch({
    path: addQueryArgs(config.api.products, {
      per_page: 100,
      search,
      orderby,
      order,
    }),
  });
}
