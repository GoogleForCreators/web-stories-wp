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
import {
  useCallback,
  useEffect,
  useState,
  useMemo,
} from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import useApi from '../../../../api/useApi';

/**
 * Hook used for taxonomy filters logic.
 * Initializes the taxonomy filters data.
 *
 * @return {Array} [taxonomies, queryTaxonomyTerms] initial taxonomy filters data and a function to query the terms.
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
   * @param {Object} taxonomy object holding taxonomy data, including restBase and restPath used to fetch individual taxonomy terms
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
   * Query all the taxonomies.
   * This should only be needed once get all the taxonomies and set individual term data.
   *
   * @see queryTaxonomyTerms
   */
  const queryTaxonomies = useCallback(async () => {
    const data = await getTaxonomies();
    const promises = [];
    const hierarchicalTaxonomies = data.filter(({ hierarchical }) =>
      Boolean(hierarchical)
    );

    for (const taxonomy of hierarchicalTaxonomies) {
      // initialize the data with an empty array
      taxonomy.data = [];
      promises.push(queryTaxonomyTerms(taxonomy));
    }

    const fetched = await Promise.all(promises);

    for (const arr of fetched) {
      // grab the first elements 'taxonomy' to map the array of terms back to the parent taxonomy
      const key = arr.at(0)?.taxonomy;
      if (key) {
        const taxonomy = hierarchicalTaxonomies.find((h) => h.slug === key);
        if (taxonomy) {
          taxonomy.data = arr;
        }
      }
    }

    setTaxonomies(hierarchicalTaxonomies);
  }, [setTaxonomies, getTaxonomies, queryTaxonomyTerms]);

  const initializeTaxonomyFilters = useCallback(() => {
    return taxonomies.map((taxonomy) => ({
      key: taxonomy.restBase,
      restPath: taxonomy.restPath,
      labels: taxonomy.labels,
      filterId: null,
      primaryOptions: taxonomy.data,
      queriedOptions: taxonomy.data,
      query: queryTaxonomyTerms,
      placeholder: taxonomy.labels.allItems,
      ariaLabel: taxonomy.labels.filterByItem,
      searchResultsLabel: taxonomy.labels.searchItems,
    }));
  }, [queryTaxonomyTerms, taxonomies]);

  useEffect(() => {
    queryTaxonomies();
  }, [queryTaxonomies]);

  return useMemo(
    () => ({ taxonomies, initializeTaxonomyFilters }),
    [taxonomies, initializeTaxonomyFilters]
  );
}

export default useTaxonomyFilters;
