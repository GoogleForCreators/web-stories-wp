/*
 * Copyright 2020 Google LLC
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
import { __ } from '@web-stories-wp/i18n';
import {
  useCallback,
  useDebouncedCallback,
  useMemo,
} from '@web-stories-wp/react';
/**
 * Internal dependencies
 */
import { useTaxonomy } from '../../../../app/taxonomy';
import cleanForSlug from '../../../../utils/cleanForSlug';
import Tags from '../../../form/tags';
import { SimplePanel } from '../../panel';

function TaxonomiesPanel(props) {
  const {
    taxonomies,
    createTerm,
    termCache,
    addSearchResultsToCache,
    setSelectedTaxonomySlugs,
    selectedSlugs,
  } = useTaxonomy(
    ({
      state: { taxonomies, termCache, selectedSlugs },
      actions: {
        createTerm,
        addSearchResultsToCache,
        setSelectedTaxonomySlugs,
      },
    }) => ({
      taxonomies,
      termCache,
      createTerm,
      addSearchResultsToCache,
      setSelectedTaxonomySlugs,
      selectedSlugs,
    })
  );

  const _handleFreeformTermsChange = useCallback(
    (taxonomy) => (termNames) => {
      termNames.forEach((termName) => createTerm(taxonomy, termName));
      setSelectedTaxonomySlugs(
        taxonomy,
        termNames.map((termName) => cleanForSlug(termName))
      );
    },
    [createTerm, setSelectedTaxonomySlugs]
  );

  const _handleFreeformInputChange = useDebouncedCallback(
    (taxonomy) => (value) => {
      if (value.length < 3) {
        return;
      }
      addSearchResultsToCache(taxonomy, value);
    },
    1000
  );

  const _termDisplayTransformer = useCallback(
    (taxonomy) => (tagName) =>
      termCache[taxonomy]?.[cleanForSlug(tagName)]?.name,
    [termCache]
  );

  // We want to prevent curried functions from creating
  // a new function on every render so we build them with
  // memoized args here instead of in the render
  const taxonomyHandlerTuples = useMemo(
    () =>
      (taxonomies || []).map((taxonomy) => [
        taxonomy,
        // handlers
        {
          handleFreeformTermsChange: _handleFreeformTermsChange(taxonomy),
          handleFreeformInputChange: _handleFreeformInputChange(taxonomy),
          termDisplayTransformer: _termDisplayTransformer(taxonomy),
        },
      ]),
    [
      taxonomies,
      _handleFreeformTermsChange,
      _handleFreeformInputChange,
      _termDisplayTransformer,
    ]
  );

  return (
    <SimplePanel
      name="taxonomies"
      title={__('Categories and Tags', 'web-stories')}
      {...props}
    >
      {taxonomyHandlerTuples.map(([taxonomy, handlers]) =>
        // TODO support all taxonomies and differentiate
        // input component based on `taxonomy.hierarchical`
        taxonomy.slug === 'story-tag' ? (
          <div key={taxonomy.slug}>
            <Tags.Label htmlFor={`${taxonomy.slug}-input`}>
              {__('Add New Term', 'web-stories')}
            </Tags.Label>
            <Tags.Input
              id={`${taxonomy.slug}-input`}
              aria-describedby={`${taxonomy.slug}-description`}
              name="story-tags"
              onTagsChange={handlers.handleFreeformTermsChange}
              onInputChange={handlers.handleFreeformInputChange}
              tagDisplayTransformer={handlers.termDisplayTransformer}
              initialTags={selectedSlugs?.[taxonomy.rest_base] || []}
            />
            <Tags.Description id={`${taxonomy.slug}-description`}>
              {__('Separate with commas or the Enter key.', 'web-stories')}
            </Tags.Description>
          </div>
        ) : null
      )}
    </SimplePanel>
  );
}

export default TaxonomiesPanel;
