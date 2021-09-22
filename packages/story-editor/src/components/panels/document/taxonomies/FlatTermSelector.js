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
import { useCallback, useDebouncedCallback } from '@web-stories-wp/react';

/**
 * Internal dependencies
 */
import Tags from '../../../form/tags';
import cleanForSlug from '../../../../utils/cleanForSlug';
import { useTaxonomy } from '../../../../app/taxonomy';
import { ContentHeading, TaxonomyPropType } from './shared';

function FlatTermSelector({ taxonomy }) {
  const {
    createTerm,
    termCache,
    addSearchResultsToCache,
    setSelectedTaxonomySlugs,
    selectedSlugs,
  } = useTaxonomy(
    ({
      state: { termCache, selectedSlugs },
      actions: {
        createTerm,
        addSearchResultsToCache,
        setSelectedTaxonomySlugs,
      },
    }) => ({
      termCache,
      createTerm,
      addSearchResultsToCache,
      setSelectedTaxonomySlugs,
      selectedSlugs,
    })
  );

  const handleFreeformTermsChange = useCallback(
    (termNames) => {
      termNames.forEach((termName) => createTerm(taxonomy, termName));
      setSelectedTaxonomySlugs(
        taxonomy,
        termNames.map((termName) => cleanForSlug(termName))
      );
    },
    [taxonomy, createTerm, setSelectedTaxonomySlugs]
  );

  const handleFreeformInputChange = useDebouncedCallback((value) => {
    if (value.length < 3) {
      return;
    }
    addSearchResultsToCache(taxonomy, { name: value });
  }, 1000);

  const termDisplayTransformer = useCallback(
    (tagName) => termCache[taxonomy]?.[cleanForSlug(tagName)]?.name,
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
          initialTags={selectedSlugs?.[taxonomy.restBase] || []}
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
