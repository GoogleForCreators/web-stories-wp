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
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from '@googleforcreators/react';

import type { Story } from "@googleforcreators/elements";

/**
 * Internal dependencies
 */
import cleanForSlug from '../../utils/cleanForSlug';
import { useAPI } from '../api';
import { useHistory } from '../history';
import { useStory } from '../story';
import Context from './context';
import {
  dictionaryOnKey,
  mapObjectVals,
  mergeNestedDictionaries,
  mapObjectKeys,
  cacheFromEmbeddedTerms,
} from './utils';

import type {
  Term,
  Taxonomy,
  TaxonomiesBySlug,
  EmbeddedTerms,
  TaxonomyState
} from '../../types/taxonomyProvider';
import type { APIState } from '../../types/apiProvider';

function TaxonomyProvider(props: { children: React.ReactNode }) {
  const [taxonomies, setTaxonomies] = useState<Taxonomy[] | never>([]);
  const [termCache, setTermCache] = useState<EmbeddedTerms>({});
  // Should grab categories on mount
  const [shouldRefetchCategories, setShouldRefetchCategories] = useState(true);
  const {
    actions: { clearHistory },
  } = useHistory();
  const { updateStory, isStoryLoaded, terms, hasTaxonomies } = useStory(
    // @ts-ignore -- @todo should this wait for #12652 ?
    ({ state: { pages, story }, actions: { updateStory } }) => ({
      updateStory,
      isStoryLoaded: pages.length > 0,
      terms: story.terms,
      hasTaxonomies: story?.taxonomies?.length > 0,
    })
  );

  const { getTaxonomyTerm, createTaxonomyTerm, getTaxonomies }: APIState["actions"] = useAPI(
    ({ actions }) => actions
  );

  // Get all registered `web-story` taxonomies.
  useEffect(() => {
    if (!hasTaxonomies || !getTaxonomies) {
      return;
    }

    (async function () {
      try {
        const result = await getTaxonomies();
        setTaxonomies(result);
      } catch (e) {
        if (e instanceof Error) {
          // eslint-disable-next-line no-console -- Log error
          console.error(e.message);
        }
      }
    })();
  }, [hasTaxonomies, getTaxonomies]);

  // Reference embedded terms in the story and taxonomies
  // to get the initial selected terms as well as populate
  // the taxonomy term cache
  const hasHydrationRunOnce = useRef(false);
  useEffect(() => {
    if (
      taxonomies && taxonomies.length > 0 &&
      isStoryLoaded &&
      !hasHydrationRunOnce || !hasHydrationRunOnce.current
    ) {
      const taxonomiesBySlug: TaxonomiesBySlug = dictionaryOnKey(taxonomies as [], 'slug');

      const initialCache: EmbeddedTerms = mapObjectKeys(
        cacheFromEmbeddedTerms(terms),
        (slug: string): string => taxonomiesBySlug[slug]?.restBase
      );

      const initialSelectedTerms = mapObjectVals(initialCache, (val: EmbeddedTerms) =>
        Object.values(val).map((term) => term.id)
      );

      setTermCache(initialCache);
      clearHistory();
      updateStory({
        properties: {
          terms: initialSelectedTerms,
        },
      });
      hasHydrationRunOnce.current = true;
    }
  }, [
    terms,
    isStoryLoaded,
    taxonomies,
    setTermCache,
    clearHistory,
    updateStory,
  ]);

  const setTerms: TaxonomyState["actions"]["setTerms"] = useCallback(
    (taxonomy, termIds) => {
      updateStory({
        properties: (story: Story) => {
          const newTerms =
            typeof termIds === 'function'
              ? termIds(story?.terms && story?.terms[taxonomy.restBase] || [])
              : termIds;
          return {
            ...story,
            terms: {
              ...story?.terms,
              [taxonomy?.restBase]: newTerms,
            },
          };
        },
      });
    },
    [updateStory]
  );

  const addTermToSelection = useCallback(
    (taxonomy: Taxonomy, term: Term) => {
      setTerms(taxonomy, (ids: number[] = []) =>
        ids.includes(term.id) ? ids : [...ids, term.id]
      );
    },
    [setTerms]
  );

  const addSearchResultsToCache: TaxonomyState["actions"]["addSearchResultsToCache"] = useCallback(
    async (taxonomy, args, addNameToSelection = false) => {
      let response: Term[] | [] = [];
      const termsEndpoint = taxonomy?.restPath;
      if (!termsEndpoint || !getTaxonomyTerm) {
        return [];
      }
      try {
        response = await getTaxonomyTerm(termsEndpoint, args);
      } catch (e) {
        // Log error
        if (e instanceof Error) {
          // eslint-disable-next-line no-console -- We want to surface this error.
          console.error(e.message);
        }
      }

      // Avoid update if we're not actually adding any terms here
      if (response.length < 1) {
        return response;
      }

      // Format results to fit in our { [taxonomy]: { [slug]: term } } map
      const termResults = {
        [taxonomy.restBase]: dictionaryOnKey(response as [], 'slug'),
      };

      setTermCache((cache: EmbeddedTerms) => mergeNestedDictionaries(cache, termResults));

      if (addNameToSelection && args.search) {
        const selectedTermSlug = cleanForSlug(args.search);
        const selectedTerm = response.find(
          (term: Term) => term.slug === selectedTermSlug
        );

        if (selectedTerm) {
          addTermToSelection(taxonomy, selectedTerm);
        }
      }

      return response;
    },
    [getTaxonomyTerm, addTermToSelection]
  );

  const createTerm: TaxonomyState["actions"]["createTerm"] = useCallback(
    async (taxonomy, termName, parent, addToSelection) => {
      const data: { name: string, parent?: number, slug?: string } = { name: termName };
      if (parent?.id) {
        data.parent = parent.id;
        data.slug = `${parent.slug}-${cleanForSlug(data.name)}`;
      }

      // make sure the term doesn't already exist locally
      const preEmptiveSlug = data?.slug || cleanForSlug(termName) || "";
      const cachedTerm = termCache[taxonomy?.restBase]?.[preEmptiveSlug];
      if (cachedTerm) {
        if (addToSelection) {
          addTermToSelection(taxonomy, cachedTerm);
        }

        return;
      }

      const termsEndpoint = taxonomy?.restPath;
      if (!termsEndpoint || !createTaxonomyTerm) {
        return;
      }

      // create term and add to cache
      try {
        const newTerm = await createTaxonomyTerm(termsEndpoint, data);
        const incomingCache = {
          [taxonomy.restBase]: { [newTerm.slug]: newTerm },
        };
        setTermCache((cache: EmbeddedTerms) => mergeNestedDictionaries(cache, incomingCache));

        if (addToSelection) {
          addTermToSelection(taxonomy, newTerm);
        }
      } catch (e) {
        // If the backend says the term already exists
        // we fetch for it as well as related terms to
        // help more thoroughly populate our cache.
        //
        // We could pull down only the exact term, but
        // we're modeling after Gutenberg.
        // @ts-ignore Reason: This is a valid error code for API errors.
        if (e.code === 'term_exists') {
          addSearchResultsToCache(
            taxonomy,
            { search: termName },
            addToSelection
          );
        }
      }
    },
    [createTaxonomyTerm, termCache, addSearchResultsToCache, addTermToSelection]
  );

  // Fetch hierarchical taxonomies on mount
  useEffect(() => {
    // only fetch when `shouldRefetchCategories` is true
    if (shouldRefetchCategories && taxonomies?.length) {
      const hierarchicalTaxonomies = taxonomies.filter(
        (taxonomy: Taxonomy) => taxonomy.hierarchical
      );
      hierarchicalTaxonomies.forEach((taxonomy: Taxonomy) =>
        addSearchResultsToCache(taxonomy, { per_page: -1 })
      );

      setShouldRefetchCategories(false);
    }
  }, [addSearchResultsToCache, shouldRefetchCategories, taxonomies]);

  const value = useMemo(
    () => ({
      state: {
        taxonomies,
        termCache,
        terms: Array.isArray(terms) ? {} : terms,
      },
      actions: {
        createTerm,
        addSearchResultsToCache,
        setTerms,
        addTermToSelection,
      },
    }),
    [
      termCache,
      terms,
      taxonomies,
      createTerm,
      addSearchResultsToCache,
      setTerms,
      addTermToSelection,
    ]
  );

  return <Context.Provider {...props} value={value} />;
}

export default TaxonomyProvider;
