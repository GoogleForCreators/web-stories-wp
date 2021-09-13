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
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  DropDown,
  Headline,
  Input,
  Text,
  themeHelpers,
  THEME_CONSTANTS,
} from '@web-stories-wp/design-system';
import {
  useCallback,
  useDebouncedCallback,
  useMemo,
  useState,
} from '@web-stories-wp/react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { useTaxonomy } from '../../../../app/taxonomy';
import cleanForSlug from '../../../../utils/cleanForSlug';
import Tags from '../../../form/tags';
import { SimplePanel } from '../../panel';
import { HierarchicalInput } from '../../../form';
import { noop } from '../../../../utils/noop';

const ContentArea = styled.div`
  label,
  * > label {
    ${({ theme }) =>
      themeHelpers.expandPresetStyles({
        preset:
          theme.typography.presets.label[
            THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL
          ],
        theme,
      })};

    color: ${({ theme }) => theme.colors.fg.secondary};
  }
`;

const ContentHeading = styled(Headline).attrs({
  as: 'h3',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XXX_SMALL,
})`
  margin: 4px 0 16px;
  font-weight: ${({ theme }) => theme.typography.weight.regular};
`;

const AddNewCategoryArea = styled.div`
  margin: 24px 0 16px;
`;

const LinkButton = styled(Button).attrs({
  variant: BUTTON_VARIANTS.LINK,
})`
  margin-bottom: 16px;

  ${({ theme }) =>
    themeHelpers.expandPresetStyles({
      preset:
        theme.typography.presets.link[
          THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL
        ],
      theme,
    })};

  font-weight: 500;
`;

const Label = styled(Text).attrs({
  forwardedAs: 'label',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  display: inline-block;
  margin: 12px 0;
`;

const AddNewCategoryButton = styled(Button).attrs({
  variant: BUTTON_VARIANTS.RECTANGLE,
  size: BUTTON_SIZES.SMALL,
  type: BUTTON_TYPES.SECONDARY,
})`
  margin-top: 20px;
`;

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

  const [showAddNewCategory, setShowAddNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const dropdownId = useMemo(uuidv4, []);

  const handleShowAddNewCategoryClick = useCallback(() => {
    setShowAddNewCategory(true);
  }, []);

  const handleChangeNewCategoryName = useCallback((evt) => {
    setNewCategoryName(evt.target.value);
  }, []);

  const handleAddCategory = useCallback(() => {
    setShowAddNewCategory(false);
  }, []);

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
      <ContentArea>
        <ContentHeading>{__('Categories', 'web-stories')}</ContentHeading>
        <HierarchicalInput
          label={__('Search Categories', 'web-stories')}
          options={[]}
          onChange={noop}
        />
        {showAddNewCategory ? (
          <AddNewCategoryArea>
            <Input
              label={__('New Category Name', 'web-stories')}
              value={newCategoryName}
              onChange={handleChangeNewCategoryName}
            />
            <Label htmlFor={dropdownId}>
              {__('Parent Category', 'web-stories')}
            </Label>
            <DropDown
              id={dropdownId}
              ariaLabel={__('Parent Category', 'web-stories')}
              placeholder={__('Parent Category', 'web-stories')}
              options={[]}
            />
            <AddNewCategoryButton onClick={handleAddCategory}>
              {__('Add Category', 'web-stories')}
            </AddNewCategoryButton>
          </AddNewCategoryArea>
        ) : (
          <LinkButton onClick={handleShowAddNewCategoryClick}>
            {__('Add New Category', 'web-stories')}
          </LinkButton>
        )}
      </ContentArea>

      <ContentHeading>{__('Tags', 'web-stories')}</ContentHeading>
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
