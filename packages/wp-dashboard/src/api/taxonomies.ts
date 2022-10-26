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
import { snakeToCamelCaseObjectKeys } from '@web-stories-wp/wp-utils';

/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import type { DashboardConfig, Taxonomy, WordPressTaxonomy } from '../types';

interface TaxonomiesArgs {
  hierarchical?: boolean;
  show_ui?: boolean;
}

/**
 * Get all taxonomies.
 *
 * @param config Configuration object.
 * @param args Query args.
 * @return Taxonomies promise.
 */
export async function getTaxonomies(
  config: DashboardConfig,
  args: TaxonomiesArgs = {}
): Promise<Taxonomy[]> {
  const result = await apiFetch<WordPressTaxonomy[]>({
    path: addQueryArgs(config.api.taxonomies, {
      type: 'web-story',
      context: 'edit',
      ...args,
    }),
  });

  return Object.values(result).map((taxonomy) => {
    const { _links, ...rest } = taxonomy;
    const newTaxonomy = {
      ...rest,
      restPath: taxonomy['_links']?.['wp:items']?.[0]?.href,
    };

    return snakeToCamelCaseObjectKeys(newTaxonomy, [
      'capabilities',
      'visibility',
    ]);
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
export function getTaxonomyTerms(
  config: DashboardConfig,
  endpoint: string,
  args = {}
) {
  return apiFetch({
    url: addQueryArgs(endpoint, args),
  });
}
