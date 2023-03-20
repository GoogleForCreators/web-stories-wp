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
  useState,
  useEffect,
} from '@googleforcreators/react';
import { __, sprintf, _n } from '@googleforcreators/i18n';
import PropTypes from 'prop-types';
import { useLiveRegion } from '@googleforcreators/design-system';
/**
 * Internal dependencies
 */
import Tags from '../../../form/tags';
import cleanForSlug from '../../../../utils/cleanForSlug';
import { useTaxonomy } from '../../../../app/taxonomy';
import { useHistory } from '../../../../app';
import { ContentHeading, TaxonomyPropType, WordCloud } from './shared';

function FlatTermSelector({ taxonomy, canCreateTerms }) {
  const [mostUsed, setMostUsed] = useState([]);
  const {
    createTerm,
    termCache,
    addSearchResultsToCache,
    terms = [],
    addTerms,
    removeTerms,
  } = useTaxonomy(
    ({
      state: { termCache, terms },
      actions: { createTerm, addSearchResultsToCache, addTerms, removeTerms },
    }) => ({
      termCache,
      createTerm,
      addSearchResultsToCache,
      terms,
      addTerms,
      removeTerms,
    })
  );

  const { undo } = useHistory(({ actions: { undo } }) => ({ undo }));
  const [searchResults, setSearchResults] = useState([]);
  const speak = useLiveRegion('assertive');

  const handleFreeformTermsChange = useCallback(
    (termNames) => {
      const currentTerms = termCache.filter(
        (term) =>
          term.taxonomy === taxonomy.slug && termNames.includes(term.name)
      );
      const removeToTerms = terms.filter(
        (term) =>
          term.taxonomy === taxonomy.slug && !termNames.includes(term.name)
      );
      removeTerms(removeToTerms);
      addTerms(currentTerms);

      // Return early if user doesn't have capability to create new terms
      if (!canCreateTerms) {
        return;
      }

      // set terms that exist in the cache
      const termNameSlugTuples = termNames.map((name) => [
        cleanForSlug(name),
        name,
      ]);

      const termNamesNotInCache = termNameSlugTuples
        .filter(
          ([slug]) =>
            !termCache
              .filter((term) => term.taxonomy === taxonomy.slug)
              .map(({ slug: thisSlug }) => thisSlug.toLowerCase())
              .includes(slug)
        )
        .map(([, name]) => name);

      // create new terms for ones that don't
      termNamesNotInCache.forEach((name) =>
        createTerm({
          taxonomy,
          termName: name,
          parent: null,
          addToSelection: true,
        })
      );
    },
    [
      termCache,
      removeTerms,
      terms,
      addTerms,
      canCreateTerms,
      createTerm,
      taxonomy,
    ]
  );

  const handleFreeformInputChange = useDebouncedCallback(async (value) => {
    if (value.length === 0) {
      setSearchResults([]);
      return;
    }

    if (value.length < 3) {
      return;
    }
    const results = await addSearchResultsToCache({
      taxonomy,
      args: {
        search: value,
        // This is the per_page value Gutenberg is using
        per_page: 20,
      },
    });
    setSearchResults(results);

    const count = results.length;
    const message = sprintf(
      /* translators: %d: number of results. */
      _n('%d result found.', '%d results found.', count, 'web-stories'),
      count
    );
    speak(message);
  }, 300);

  const tokens = useMemo(() => {
    return terms
      .filter((term) => term.taxonomy === taxonomy.slug)
      .filter((term) => term !== undefined)
      .map((term) => term.name);
  }, [terms, taxonomy]);

  const termDisplayTransformer = useCallback(
    (tagName) => termCache.filter((term) => term.name === tagName)?.[0]?.name,
    [termCache]
  );

  useEffect(() => {
    (async function () {
      const results = await addSearchResultsToCache({
        taxonomy,
        args: {
          orderby: 'count',
          order: 'desc',
          hide_empty: true,
        },
      });
      setMostUsed(results);
    })();
  }, [taxonomy, addSearchResultsToCache]);

  return (
    <>
      <ContentHeading>{taxonomy.labels.name}</ContentHeading>
      <div key={taxonomy.slug}>
        <Tags.Label htmlFor={`${taxonomy.slug}-input`}>
          {taxonomy.labels.addNewItem}
        </Tags.Label>
        <Tags.Input
          id={`${taxonomy.slug}-input`}
          aria-describedby={`${taxonomy.slug}-description`}
          name={taxonomy.slug}
          onTagsChange={handleFreeformTermsChange}
          onInputChange={handleFreeformInputChange}
          tagDisplayTransformer={termDisplayTransformer}
          tokens={tokens}
          onUndo={undo}
          suggestedTerms={searchResults}
          suggestedTermsLabel={taxonomy?.labels?.itemsList}
        />
        <Tags.Description id={`${taxonomy.slug}-description`}>
          {taxonomy.labels.separateItemsWithCommas}
        </Tags.Description>
        {mostUsed?.length > 0 && (
          <WordCloud.Wrapper data-testid={`${taxonomy.slug}-most-used`}>
            <WordCloud.Heading>{taxonomy.labels.mostUsed}</WordCloud.Heading>
            <WordCloud.List>
              {mostUsed.map((term, i) => (
                <WordCloud.ListItem key={term.id}>
                  <WordCloud.Word
                    onClick={() => {
                      if (terms.map(({ id }) => id).includes(term.id)) {
                        return;
                      }
                      addTerms([term]);
                    }}
                  >
                    {term.name}

                    {i < mostUsed.length - 1 &&
                      /* translators: delimiter used in a list */
                      __(',', 'web-stories')}
                  </WordCloud.Word>
                  {
                    /* Browser only respects the white space in the li, not the button */
                    i < mostUsed.length - 1 && ' '
                  }
                </WordCloud.ListItem>
              ))}
            </WordCloud.List>
          </WordCloud.Wrapper>
        )}
      </div>
    </>
  );
}

FlatTermSelector.propTypes = {
  taxonomy: TaxonomyPropType,
  canCreateTerms: PropTypes.bool,
};

export default FlatTermSelector;
