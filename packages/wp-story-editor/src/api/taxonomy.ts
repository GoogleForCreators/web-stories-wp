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
import { addQueryArgs } from '@googleforcreators/url';
import { snakeToCamelCaseObjectKeys } from '@web-stories-wp/wp-utils';

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
/**
 * Internal dependencies
 */
import type { Config } from '../types';

/**
 * Get all taxonomies.
 *
 * @param config Configuration object.
 * @return Taxonomies promise.
 */
export async function getTaxonomies(config: Config) {
  const result = await apiFetch({
    path: addQueryArgs(config.api.taxonomies, {
      type: config.postType,
      context: 'edit',
      show_ui: 'true',
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
 * @param config configuration object.
 * @param endpoint absolute url to interact with taxonomy
 * @param args Additional args.
 * @return Term promise.
 */
export function getTaxonomyTerm(config: Config, endpoint: string, args = {}) {
  return apiFetch({
    url: addQueryArgs(endpoint, args),
  });
}

/**
 * Create a new taxonomy term.
 *
 * @param config configuration object.
 * @param endpoint absolute url to interact with taxonomy
 * @param args The args being sent.
 * @param args.name The name.
 * @param args.parent The parent id.
 * @return Term promise.
 */
export function createTaxonomyTerm(config: Config, endpoint: string, args) {
  return apiFetch({
    url: addQueryArgs(endpoint, args),
    method: 'POST',
  });
}
