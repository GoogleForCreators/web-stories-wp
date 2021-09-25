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
  useDebouncedCallback,
  useMemo,
} from '@web-stories-wp/react';

/**
 * Internal dependencies
 */
import Tags, { deepEquals } from '../../../form/tags';
import cleanForSlug from '../../../../utils/cleanForSlug';
import { useTaxonomy } from '../../../../app/taxonomy';
import { ContentHeading, TaxonomyPropType } from './shared';

function FlatTermSelector({ taxonomy }) {
  const { createTerm, termCache, addSearchResultsToCache, terms, setTerms } =
    useTaxonomy(
      ({
        state: { termCache, terms },
        actions: { createTerm, addSearchResultsToCache, setTerms },
      }) => ({
        termCache,
        createTerm,
        addSearchResultsToCache,
        terms,
        setTerms,
      })
    );

  const handleFreeformTermsChange = useCallback(
    (termNames) => {
      // set terms that exist in the cache
      const termNameSlugTuples = termNames.map((name) => [
        cleanForSlug(name),
        name,
      ]);
      const termsInCache = termNameSlugTuples
        .map(([slug]) => slug)
        .map((slug) => termCache[taxonomy.restBase]?.[slug])
        .filter((v) => v)
        .map((term) => term.id);

      // We don't want to cause a redundant history entry
      if (!deepEquals(terms[taxonomy.restBase], termsInCache)) {
        setTerms(taxonomy, termsInCache);
      }

      const termNamesNotInCache = termNameSlugTuples
        .filter(([slug]) => !termCache[taxonomy.restBase]?.[slug])
        .map(([, name]) => name);

      // create new terms for ones that don't
      termNamesNotInCache.forEach((name) =>
        createTerm(taxonomy, name, null, true)
      );
    },
    [taxonomy, createTerm, termCache, setTerms, terms]
  );

  const handleFreeformInputChange = useDebouncedCallback((value) => {
    if (value.length < 3) {
      return;
    }
    addSearchResultsToCache(taxonomy, { name: value });
  }, 1000);

  const tokens = useMemo(() => {
    return (terms[taxonomy.restBase] || [])
      .map((id) => {
        const term = Object.values(termCache[taxonomy.restBase] || {}).find(
          (term) => term.id === id
        );
        return term;
      })
      .filter((term) => term !== undefined)
      .map((term) => term.name);
  }, [taxonomy, terms, termCache]);

  const termDisplayTransformer = useCallback(
    (tagName) => termCache[taxonomy.restBase]?.[cleanForSlug(tagName)]?.name,
    [taxonomy, termCache]
  );

  return (
    <>
      <ContentHeading>{taxonomy.labels.name}</ContentHeading>
      <div key={taxonomy.slug}>
        <Tags.Label htmlFor={`${taxonomy.slug}-input`}>
          {taxonomy.labels.add_new_item}
        </Tags.Label>
        <Tags.Input
          id={`${taxonomy.slug}-input`}
          aria-describedby={`${taxonomy.slug}-description`}
          name={taxonomy.slug}
          onTagsChange={handleFreeformTermsChange}
          onInputChange={handleFreeformInputChange}
          tagDisplayTransformer={termDisplayTransformer}
          tokens={tokens}
        />
        <Tags.Description id={`${taxonomy.slug}-description`}>
          {taxonomy.labels.separate_items_with_commas}
        </Tags.Description>
      </div>
    </>
  );
}

FlatTermSelector.propTypes = {
  taxonomy: TaxonomyPropType,
};

export default FlatTermSelector;
