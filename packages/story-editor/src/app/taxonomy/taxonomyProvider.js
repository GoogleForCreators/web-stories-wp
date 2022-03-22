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

function TaxonomyProvider(props) {
  const [taxonomies, setTaxonomies] = useState([]);
  const [termCache, setTermCache] = useState({});
  // Should grab categories on mount
  const [shouldRefetchCategories, setShouldRefetchCategories] = useState(true);
  const {
    actions: { clearHistory },
  } = useHistory();
  const { updateStory, isStoryLoaded, terms, hasTaxonomies } = useStory(
    ({ state: { pages, story }, actions: { updateStory } }) => ({
      updateStory,
      isStoryLoaded: pages.length > 0,
      terms: story.terms,
      hasTaxonomies: story?.taxonomies?.length > 0,
    })
  );

  const { getTaxonomyTerm, createTaxonomyTerm, getTaxonomies } = useAPI(
    ({ actions }) => actions
  );

  // Get all registered `web-story` taxonomies.
  useEffect(() => {
    if (!hasTaxonomies) {
      return;
    }

    (async function () {
      try {
        const result = await getTaxonomies();
        setTaxonomies(result);
      } catch (e) {
        // eslint-disable-next-line no-console -- Log error
        console.error(e.message);
      }
    })();
  }, [hasTaxonomies, getTaxonomies]);

  // Reference embedded terms in the story and taxonomies
  // to get the initial selected terms as well as populate
  // the taxonomy term cache
  const hasHydrationRunOnce = useRef(false);
  useEffect(() => {
    if (
      taxonomies.length > 0 &&
      isStoryLoaded &&
      !hasHydrationRunOnce.current
    ) {
      const taxonomiesBySlug = dictionaryOnKey(taxonomies, 'slug');
      const initialCache = mapObjectKeys(
        cacheFromEmbeddedTerms(terms),
        (slug) => taxonomiesBySlug[slug]?.restBase
      );
      const initialSelectedTerms = mapObjectVals(initialCache, (val) =>
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

  const setTerms = useCallback(
    (taxonomy, termIds = []) => {
      updateStory({
        properties: (story) => {
          const newTerms =
            typeof termIds === 'function'
              ? termIds(story.terms[taxonomy.restBase])
              : termIds;

          return {
            ...story,
            terms: {
              ...story.terms,
              [taxonomy.restBase]: newTerms,
            },
          };
        },
      });
    },
    [updateStory]
  );

  const addTermToSelection = useCallback(
    (taxonomy, term) => {
      setTerms(taxonomy, (ids = []) =>
        ids.includes(term.id) ? ids : [...ids, term.id]
      );
    },
    [setTerms]
  );

  const addSearchResultsToCache = useCallback(
    async (taxonomy, args, addNameToSelection = false) => {
      let response = [];
      const termsEndpoint = taxonomy?.restPath;
      if (!termsEndpoint) {
        return [];
      }
      try {
        response = await getTaxonomyTerm(termsEndpoint, args);
      } catch (e) {
        // Log error
        // eslint-disable-next-line no-console -- We want to surface this error.
        console.error(e.message);
      }

      // Avoid update if we're not actually adding any terms here
      if (response.length < 1) {
        return response;
      }

      // Format results to fit in our { [taxonomy]: { [slug]: term } } map
      const termResults = {
        [taxonomy.restBase]: dictionaryOnKey(response, 'slug'),
      };

      setTermCache((cache) => mergeNestedDictionaries(cache, termResults));

      if (addNameToSelection && args.search) {
        const selectedTermSlug = cleanForSlug(args.search);
        const selectedTerm = response.find(
          (term) => term.slug === selectedTermSlug
        );

        if (selectedTerm) {
          addTermToSelection(taxonomy, selectedTerm);
        }
      }

      return response;
    },
    [getTaxonomyTerm, addTermToSelection]
  );

  const createTerm = useCallback(
    async (taxonomy, termName, parent, addToSelection = false) => {
      const data = { name: termName };
      if (parent?.id) {
        data.parent = parent.id;
        data.slug = `${parent.slug}-${cleanForSlug(data.name)}`;
      }

      // make sure the term doesn't already exist locally
      const preEmptiveSlug = data?.slug || cleanForSlug(termName);
      const cachedTerm = termCache[taxonomy.restBase]?.[preEmptiveSlug];
      if (cachedTerm) {
        if (addToSelection) {
          addTermToSelection(taxonomy, cachedTerm);
        }

        return;
      }

      const termsEndpoint = taxonomy?.restPath;
      if (!termsEndpoint) {
        return;
      }

      // create term and add to cache
      try {
        const newTerm = await createTaxonomyTerm(termsEndpoint, data);
        const incomingCache = {
          [taxonomy.restBase]: { [newTerm.slug]: newTerm },
        };
        setTermCache((cache) => mergeNestedDictionaries(cache, incomingCache));

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
        (taxonomy) => taxonomy.hierarchical
      );
      hierarchicalTaxonomies.forEach((taxonomy) =>
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
