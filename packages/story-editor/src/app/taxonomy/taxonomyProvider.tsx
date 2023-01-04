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
import type {
  Story,
  Term,
  Taxonomy,
  TermSlug,
} from '@googleforcreators/elements';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from '@googleforcreators/react';
import type { PropsWithChildren } from 'react';

/**
 * Internal dependencies
 */
import type {
  createTermProps,
  setTermsProps,
  TaxonomyRestError,
  addTermToSelectionProps,
  addSearchResultsToCacheProps,
  removeTermsProps,
} from '../../types';
import cleanForSlug from '../../utils/cleanForSlug';
import { useAPI } from '../api';
import { useStory } from '../story';
import Context from './context';

function TaxonomyProvider(props: PropsWithChildren<unknown>) {
  // Should grab categories on mount
  const [shouldRefetchCategories, setShouldRefetchCategories] =
    useState<boolean>(true);
  const { updateStory, terms } = useStory((state) => ({
    updateStory: state.actions.updateStory,
    terms: state.state.story?.terms || [],
  }));
  const [hasTaxonomies, setHasTaxonomies] = useState<boolean>(false);
  const [taxonomies, setTaxonomies] = useState<Taxonomy[]>([]);
  const [termCache, setTermCache] = useState<Term[]>(terms);

  const {
    actions: { getTaxonomyTerm, createTaxonomyTerm, getTaxonomies },
  } = useAPI();

  // Get all registered `web-story` taxonomies.
  useEffect(() => {
    if (hasTaxonomies || !getTaxonomies) {
      return;
    }

    void (async () => {
      try {
        const result = await getTaxonomies();
        setTaxonomies(result);
      } catch (e) {
        if (e instanceof Error) {
          // eslint-disable-next-line no-console -- Log error
          console.error(e.message);
        }
      } finally {
        setHasTaxonomies(true);
      }
    })();
  }, [hasTaxonomies, getTaxonomies]);

  const setTerms = useCallback(
    ({ newTerms }: setTermsProps) => {
      if (updateStory) {
        updateStory({
          properties: (story: Partial<Story>) => {
            const currentTerms = story?.terms || [];
            const newAssignedTerms = [
              ...new Set([...currentTerms, ...newTerms]),
            ];
            return {
              ...story,
              terms: newAssignedTerms,
            };
          },
        });
      }
    },
    [updateStory]
  );

  const removeTerms = useCallback(
    ({ removeTerms }: removeTermsProps) => {
      if (updateStory) {
        const removeTermsID = removeTerms.map(({ id }) => id);
        updateStory({
          properties: (story: Partial<Story>) => {
            const currentTerms = story?.terms || [];
            const newAssignedTerms = currentTerms.filter(({ id }) => !removeTermsID.includes(id));
            return {
              ...story,
              terms: newAssignedTerms,
            };
          },
        });
      }
    },
    [updateStory]
  );

  const addTermToSelection = useCallback(
    ({ newTerms }: addTermToSelectionProps) => setTerms({ newTerms }),
    [setTerms]
  );

  const addSearchResultsToCache = useCallback(
    async ({
      taxonomy,
      args,
      addNameToSelection = false,
    }: addSearchResultsToCacheProps) => {
      let termResults: Term[] = [];
      const termsEndpoint = taxonomy?.restPath;
      if (!termsEndpoint || !getTaxonomyTerm) {
        return [];
      }
      try {
        termResults = await getTaxonomyTerm(termsEndpoint, {
          search: args?.search,
          per_page: args?.per_page,
        });
      } catch (e) {
        // Log error
        if (e instanceof Error) {
          // eslint-disable-next-line no-console -- We want to surface this error.
          console.error(e.message);
        }
      }

      // Avoid update if we're not actually adding any terms here
      if (termResults.length < 1) {
        return termResults;
      }

      setTermCache((cache: Term[]) => [...cache, ...termResults]);

      if (addNameToSelection && args.search) {
        const selectedTermSlug: TermSlug = cleanForSlug(args.search);
        const selectedTerm = termResults.find(
          (term: Term) => term.slug === selectedTermSlug
        );

        if (selectedTerm) {
          addTermToSelection({ newTerms: [selectedTerm] });
        }
      }

      return termResults;
    },
    [getTaxonomyTerm, addTermToSelection]
  );

  const createTerm = useCallback(
    async ({
      taxonomy,
      termName,
      parent,
      addToSelection = false,
    }: createTermProps) => {
      const data: Term = {
        name: termName,
      } as Term;
      if (parent?.id) {
        data.parent = parent.id;
        data.slug = `${parent.slug}-${cleanForSlug(data.name)}`;
      }

      // make sure the term doesn't already exist locally
      const preEmptiveSlug = data?.slug || cleanForSlug(termName) || '';
      const cachedTerm : Term | undefined = termCache.find(
        (term: Term) => term.slug === preEmptiveSlug && term.taxonomy === taxonomy.slug
      );
      if (cachedTerm) {
        if (addToSelection) {
          addTermToSelection({ newTerms: [cachedTerm] });
        }

        return;
      }

      const termsEndpoint = taxonomy?.restPath;
      if (!termsEndpoint || !createTaxonomyTerm) {
        return;
      }

      // create term and add to cache
      try {
        const newTerm: Term = await createTaxonomyTerm(termsEndpoint, data);
        setTermCache((cache: Term[]) => [...cache, newTerm]);

        if (addToSelection) {
          addTermToSelection({ newTerms: [newTerm] });
        }
      } catch (e) {
        // If the backend says the term already exists
        // we fetch for it as well as related terms to
        // help more thoroughly populate our cache.
        //
        // We could pull down only the exact term, but
        // we're modeling after Gutenberg.
        if ((e as TaxonomyRestError).code === 'term_exists') {
          void addSearchResultsToCache({
            taxonomy,
            args: { search: termName },
            addNameToSelection: addToSelection,
          });
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
      hierarchicalTaxonomies.forEach(
        (taxonomy: Taxonomy) =>
          void addSearchResultsToCache({ taxonomy, args: { per_page: -1 } })
      );

      setShouldRefetchCategories(false);
    }
  }, [addSearchResultsToCache, shouldRefetchCategories, taxonomies]);

  const value = useMemo(
    () => ({
      state: {
        taxonomies,
        termCache,
        terms,
      },
      actions: {
        createTerm,
        addSearchResultsToCache,
        setTerms,
        removeTerms,
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
      removeTerms,
      addTermToSelection,
    ]
  );

  return <Context.Provider {...props} value={value} />;
}

export default TaxonomyProvider;
