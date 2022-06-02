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
 * Hook used for taxonomy filters logic
 * Initilizes the taxonomy filters data
 *
 * @return {Array} [taxonomies, queryTaxonomyTerm] initial taxonomy filters data and a function to query the terms
 */

function useTaxonomyFilters() {
  const [taxonomies, setTaxonomies] = useState([]);

  const { getTaxonomies, getTaxonomyTerm } = useApi(
    ({
      actions: {
        taxonomyApi: { getTaxonomies, getTaxonomyTerm },
      },
    }) => ({
      getTaxonomies,
      getTaxonomyTerm,
    })
  );

  /**
   * Query individual taxonomy data
   * This is needed to initilize the primaryOptions and needed to search and set queriedOptions
   *
   * @param {Object} taxonomy object holding taxonomy data, including restBase and restPath used to fetch individual taxonomy terms
   * @param {string|undefined} search string use to query taxonomy by name
   * @return {Array} taxonomy terms
   */
  const queryTaxonomyTerm = useCallback(
    async (taxonomy, search) => {
      const { restBase, restPath } = taxonomy;
      const terms = await getTaxonomyTerm(restPath, { search });
      return terms.map((t) => ({
        ...t,
        restBase,
        restPath,
      }));
    },
    [getTaxonomyTerm]
  );

  /**
   * Query all the taxonomies
   * This should only be needed once get all the taxonomies and set individual term data
   *
   * @see queryTaxonomyTerm
   */
  const queryTaxonomies = useCallback(async () => {
    const data = await getTaxonomies();
    const promises = [];
    const hierarchicalTaxonomies = data.filter(({ hierarchical }) =>
      Boolean(hierarchical)
    );

    for (const taxonomy of hierarchicalTaxonomies) {
      // initilize the data with an empty array
      taxonomy.data = [];
      promises.push(queryTaxonomyTerm(taxonomy));
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
  }, [setTaxonomies, getTaxonomies, queryTaxonomyTerm]);

  useEffect(() => {
    queryTaxonomies();
  }, [queryTaxonomies]);

  return useMemo(
    () => ({ taxonomies, queryTaxonomyTerm }),
    [taxonomies, queryTaxonomyTerm]
  );
}

export default useTaxonomyFilters;
