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
 * Internal dependencies
 */
import type { Config } from '../types';

/**
 * Get products
 *
 * @param config Configuration object.
 * @param search Search term.
 * @param page Page number.
 * @param orderby Order collection by product attribute.
 * @param order Sort attribute ascending or descending.
 * @return The response from the API.
 */
export async function getProducts(
  config: Config,
  search: string,
  page: number,
  orderby: string,
  order: string
) {
  const response = await apiFetch({
    path: addQueryArgs(config.api.products, {
      per_page: 50,
      page,
      search,
      orderby,
      order,
      _web_stories_envelope: true,
    }),
  });

  return {
    products: response?.body,
    hasNextPage: response?.headers['X-WP-HasNextPage'] === 'true',
  };
}
