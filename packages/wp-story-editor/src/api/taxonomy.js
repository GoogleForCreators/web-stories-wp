/*
 * Copyright 2021 Google LLC
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
import { addQueryArgs } from '@web-stories-wp/design-system';

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
/**
 * Internal dependencies
 */
import { snakeCaseToCamelCase } from './utils';

/**
 * Get all taxonomies.
 *
 * @param {string} postType Post type.
 * @param {string} path API path.
 * @return {Promise} Taxonomies promise.
 */
export async function getTaxonomies(postType, path) {
  const result = await apiFetch({
    path: addQueryArgs(path, {
      type: postType,
      context: 'edit',
    }),
  });

  return Object.values(result).map((taxonomy) => {
    const entries = Object.entries(taxonomy);

    const formattedEntries = entries.map((entry) => [
      snakeCaseToCamelCase(entry[0]),
      entry[1],
    ]);

    return Object.fromEntries(formattedEntries);
  });
}

/**
 * Get a taxonomy term.
 *
 * @param {string} endpoint absolute url to interact with taxonomy
 * @param {Object} args Additional args.
 * @return {Promise} Term promise.
 */
export function getTaxonomyTerm(endpoint, args = {}) {
  return apiFetch({
    url: addQueryArgs(endpoint, args),
  });
}

/**
 * Create a new taxonomy term.
 *
 * @param {string} endpoint absolute url to interact with taxonomy
 * @param {Object} args The args being sent.
 * @param {string} args.name The name.
 * @param {number|string} args.parent The parent id.
 * @return {Promise} Term promise.
 */
export function createTaxonomyTerm(endpoint, args) {
  return apiFetch({
    url: addQueryArgs(endpoint, args),
    method: 'POST',
  });
}
