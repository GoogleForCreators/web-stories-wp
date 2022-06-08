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
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * External dependencies
 */
import { addQueryArgs } from '@googleforcreators/url';
import { snakeToCamelCaseObjectKeys } from '@web-stories-wp/wp-utils';

/**
 * Get all taxonomies.
 *
 * @param {Object} config Configuration object.
 * @return {Promise} Taxonomies promise.
 */

export async function getTaxonomies(config) {
  const result = await apiFetch({
    path: addQueryArgs(config.api.taxonomies, {
      type: 'web-story',
      context: 'edit',
    }),
  });

  return Object.values(result).map((taxonomy) => {
    taxonomy.restPath = taxonomy['_links']?.['wp:items']?.[0]?.href;
    delete taxonomy['_links'];

    return snakeToCamelCaseObjectKeys(taxonomy, ['capabilities', 'visibility']);
  });
}

/**
 * Get a taxonomy term.
 *
 * @param {Object} config configuration object.
 * @param {string} endpoint absolute url to interact with taxonomy
 * @param {Object} args Additional args.
 * @return {Promise} Term promise.
 */

export function getTaxonomyTerms(config, endpoint, args = {}) {
  return apiFetch({
    url: addQueryArgs(endpoint, args),
  });
}
