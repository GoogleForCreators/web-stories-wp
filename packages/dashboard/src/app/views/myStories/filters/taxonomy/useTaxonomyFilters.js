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
import { useCallback, useEffect, useState } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import useApi from '../../../../api/useApi';

const cachedPrimaryOptions = {};

/**
 * Hook used for taxonomy filters logic.
 * Initializes the taxonomy filters data.
 *
 * @return {Object} initializeTaxonomyFilters taxonomies and a function to shape the taxonoimes filter data.
 */

function useTaxonomyFilters() {
  const [taxonomies, setTaxonomies] = useState([]);

  const { getTaxonomies, getTaxonomyTerms } = useApi(
    ({
      actions: {
        taxonomyApi: { getTaxonomies, getTaxonomyTerms },
      },
    }) => ({
      getTaxonomies,
      getTaxonomyTerms,
    })
  );

  /**
   * Query individual taxonomy data.
   * This is needed to initialize the primaryOptions and needed to search and set queriedOptions.
   *
   * @param {Object} taxonomy object holding taxonomy data,
   * including restBase and restPath used to fetch individual taxonomy terms
   * @param {string} search string use to query taxonomy by name
   * @return {Array} taxonomy terms
   */
  const queryTaxonomyTerms = useCallback(
    async (taxonomy, search) => {
      const { restBase, restPath } = taxonomy;
      const terms = await getTaxonomyTerms(restPath, { search, per_page: -1 });
      return terms.map((t) => ({
        ...t,
        restBase,
        restPath,
      }));
    },
    [getTaxonomyTerms]
  );

  /**
   * Get taxonomy terms for a given taxonomy. Cache for later use.
   * This is needed to initialize the primaryOptions.
   * See design-system/src/component/datalist
   *
   * @see queryTaxonomyTerms
   * @param {Object} taxonomy object holding taxonomy data,
   * including restBase and restPath used to fetch individual taxonomy terms
   * @return {Array} cached taxonomy terms
   */
  const getPrimaryOptions = useCallback(
    async (taxonomy) => {
      const { restBase } = taxonomy;
      if (!cachedPrimaryOptions[restBase]) {
        cachedPrimaryOptions[restBase] = await queryTaxonomyTerms(taxonomy);
      }
      return cachedPrimaryOptions[restBase];
    },
    [queryTaxonomyTerms]
  );

  /**
   * Query all the taxonomies.
   * This should only be needed once to get all the taxonomies.
   *
   */
  const queryTaxonomies = useCallback(async () => {
    setTaxonomies(await getTaxonomies({ hierarchical: true, show_ui: true }));
  }, [getTaxonomies]);

  /**
   * Sets up the shape of the taxonomy filters data
   *
   * @return {Array} taxonomies filter data
   */
  const initializeTaxonomyFilters = useCallback(() => {
    return taxonomies.map((taxonomy) => ({
      key: taxonomy.restBase,
      restPath: taxonomy.restPath,
      placeholder: taxonomy.labels.allItems,
      ariaLabel: taxonomy.labels.filterByItem,
      noMatchesFoundLabel: taxonomy.labels.notFound,
      searchPlaceholder: taxonomy.labels.searchItems,
      query: (search) => queryTaxonomyTerms(taxonomy, search),
      getPrimaryOptions: () => getPrimaryOptions(taxonomy),
    }));
  }, [queryTaxonomyTerms, getPrimaryOptions, taxonomies]);

  useEffect(() => {
    queryTaxonomies();
  }, [queryTaxonomies]);

  return initializeTaxonomyFilters;
}

export default useTaxonomyFilters;
