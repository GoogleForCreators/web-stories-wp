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

const useTaxonomyFilters = () => {
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

  // query individual taxonomies
  // this is needed to init the primaryOptions
  // and needed to search queriedOptions
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

  // query all the taxonomies
  // this should only be needed once
  const queryTaxonomies = useCallback(async () => {
    const data = await getTaxonomies();
    const hierarchicalTaxonomies = data.filter(({ hierarchical }) =>
      Boolean(hierarchical)
    );

    for (const taxonomy of hierarchicalTaxonomies) {
      taxonomy.data = await queryTaxonomyTerm(taxonomy);
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
};

export default useTaxonomyFilters;
