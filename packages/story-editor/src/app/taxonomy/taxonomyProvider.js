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
  useMemo,
  useState,
  useEffect,
  useRef,
} from '@web-stories-wp/react';
/**
 * Internal dependencies
 */
import cleanForSlug from '../../utils/cleanForSlug';
import { useAPI } from '../api';
import { useStory } from '../story';
import Context from './context';

function TaxonomyProvider(props) {
  const [taxonomies, setTaxonomies] = useState([]);
  const [selectedFreeformSlugs, _setSelectedFreeformSlugs] = useState({});
  const [freeformCache, setFreeformCache] = useState({});
  const { updateStory, isStoryLoaded, story } = useStory(
    ({ state: { pages, story }, actions: { updateStory } }) => ({
      updateStory,
      isStoryLoaded: pages.length > 0,
      story,
    })
  );

  const { getTaxonomyTerm, createTaxonomyTerm, getTaxonomies } = useAPI(
    ({ actions }) => actions
  );

  // Hydrate selected slugs from initial story load
  const hasHydratedRunOnce = useRef(false);
  useEffect(() => {
    if (taxonomies.length > 0 && isStoryLoaded && !hasHydratedRunOnce.current) {
      const taxonomySlugToRestBaseMap = taxonomies.reduce(
        (_taxonomySlugToBaseMap, taxonomy) => {
          _taxonomySlugToBaseMap[taxonomy.slug] = taxonomy.rest_base;
          return _taxonomySlugToBaseMap;
        },
        {}
      );

      const initialCache = (story.embeddedTerms || []).reduce(
        (_initialCache, taxonomy) => {
          (taxonomy || []).forEach((term) => {
            _initialCache[taxonomySlugToRestBaseMap[term.taxonomy]] =
              _initialCache[taxonomySlugToRestBaseMap[term.taxonomy]] || {};
            _initialCache[taxonomySlugToRestBaseMap[term.taxonomy]][term.slug] =
              term;
          });
          return _initialCache;
        },
        {}
      );

      const initialSelectedSlugs = Object.entries(initialCache).reduce(
        (_initialSelectedSlugs, [taxonomyRestBase, slugTermMap]) => {
          _initialSelectedSlugs[taxonomyRestBase] = Object.keys(slugTermMap);
          return _initialSelectedSlugs;
        },
        {}
      );

      hasHydratedRunOnce.current = true;
      setFreeformCache(initialCache);
      _setSelectedFreeformSlugs(initialSelectedSlugs);
    }
  }, [
    story,
    isStoryLoaded,
    taxonomies,
    _setSelectedFreeformSlugs,
    setFreeformCache,
  ]);

  // sync up story data with existing terms
  useEffect(() => {
    const terms = Object.entries(selectedFreeformSlugs)
      .map(([taxonomyRestBase, termSlugs = []]) => [
        taxonomyRestBase,
        termSlugs
          .map((termSlug) => freeformCache[taxonomyRestBase]?.[termSlug])
          .filter((term) => Boolean(term))
          .map((term) => term.id),
      ])
      .reduce((_taxonomies, [taxonomyRestBase, termIds]) => {
        _taxonomies[taxonomyRestBase] = termIds;
        return _taxonomies;
      }, {});

    updateStory({
      properties: terms,
    });
  }, [updateStory, selectedFreeformSlugs, freeformCache]);

  useEffect(() => {
    (async function () {
      try {
        const result = await getTaxonomies();
        setTaxonomies(Object.values(result));
      } catch (e) {
        // Do we wanna do anything here?
      }
    })();
  }, [getTaxonomies]);

  const addSearchResultsToCache = useCallback(
    async (taxonomy, name) => {
      let response = [];
      try {
        response = await getTaxonomyTerm(taxonomy.rest_base, {
          search: name,
          // This is the per_page value Guttenberg is using
          per_page: 20,
        });
      } catch (e) {
        // Do we wanna do anything here?
      }

      // Avoid update if we're not actually adding any terms here
      if (response.length < 1) {
        return;
      }

      // Format results to fit in our {[taxonomy]: {[slug]: term}} map
      const termResults = response.reduce((acc, term) => {
        acc[term.slug] = term;
        return acc;
      }, {});
      setFreeformCache((cache) => {
        return {
          ...cache,
          [taxonomy.rest_base]: {
            ...termResults,
            ...cache[taxonomy.rest_base],
          },
        };
      });
    },
    [getTaxonomyTerm]
  );

  const createTerm = useCallback(
    async (taxonomy, termName) => {
      // make sure the term doesn't already exist locally
      if (freeformCache[taxonomy.rest_base]?.[cleanForSlug(termName)]) {
        return;
      }

      // create term and add to cache
      try {
        const newTerm = await createTaxonomyTerm(taxonomy.rest_base, termName);
        setFreeformCache((cache) => ({
          ...cache,
          [taxonomy.rest_base]: {
            ...cache[taxonomy.rest_base],
            [newTerm.slug]: newTerm,
          },
        }));
      } catch (e) {
        // If the backend says the term already exists
        // we fetch for it as well as related terms to
        // help more thoroughly populate our cache.
        //
        // We could pull down only the exact term, but
        // we're modeling after Guttenberg.
        if (e.code === 'term_exists') {
          addSearchResultsToCache(taxonomy, termName);
        }
      }
    },
    [createTaxonomyTerm, freeformCache, addSearchResultsToCache]
  );

  const setSelectedFreeformSlugs = useCallback(
    (taxonomy, termSlugs = []) =>
      _setSelectedFreeformSlugs((selected) => ({
        ...selected,
        [taxonomy.rest_base]: termSlugs,
      })),
    [_setSelectedFreeformSlugs]
  );

  const value = useMemo(
    () => ({
      state: {
        taxonomies,
        freeformCache,
        selectedFreeformSlugs: selectedFreeformSlugs,
      },
      actions: {
        createTerm,
        addSearchResultsToCache,
        setSelectedFreeformSlugs,
      },
    }),
    [
      taxonomies,
      createTerm,
      freeformCache,
      addSearchResultsToCache,
      selectedFreeformSlugs,
      setSelectedFreeformSlugs,
    ]
  );

  return <Context.Provider {...props} value={value} />;
}

export default TaxonomyProvider;
