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
import { __ } from '@web-stories-wp/i18n';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  DropDown,
  Input,
  Text,
  THEME_CONSTANTS,
  themeHelpers,
} from '@web-stories-wp/design-system';
import { useCallback, useMemo, useState } from '@web-stories-wp/react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { HierarchicalInput } from '../../../form';
import { useTaxonomy } from '../../../../app/taxonomy';
import { ContentHeading, TaxonomyPropType } from './shared';

const NO_PARENT_VALUE = 'NO_PARENT_VALUE';

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

const AddNewCategoryForm = styled.form`
  margin: 24px 0 16px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
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

function HierarchicalTermSelector({ noParentId = NO_PARENT_VALUE, taxonomy }) {
  const { createTerm, selectedSlugs, setSelectedTaxonomySlugs, termCache } =
    useTaxonomy(
      ({
        state: { selectedSlugs, termCache },
        actions: { createTerm, setSelectedTaxonomySlugs },
      }) => ({
        createTerm,
        selectedSlugs,
        setSelectedTaxonomySlugs,
        termCache,
      })
    );

  const categories = useMemo(() => {
    if (termCache[taxonomy.restBase]) {
      return Object.values(termCache[taxonomy.restBase]).map((category) => {
        const formattedCategory = { ...category };
        formattedCategory.value = formattedCategory.id;
        formattedCategory.label = formattedCategory.name;
        formattedCategory.checked = selectedSlugs[taxonomy.restBase]?.includes(
          category.slug
        );

        return formattedCategory;
      });
    }

    return [];
  }, [selectedSlugs, taxonomy, termCache]);

  const dropdownCategories = useMemo(
    () =>
      [
        {
          value: NO_PARENT_VALUE,
          label: `-- ${taxonomy.labels.parent_item} --`,
        },
      ].concat(categories),
    [categories, taxonomy]
  );

  const [showAddNewCategory, setShowAddNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedParent, setSelectedParent] = useState(noParentId);
  const dropdownId = useMemo(uuidv4, []);

  const resetInputs = useCallback(() => {
    setNewCategoryName('');
    setSelectedParent(noParentId);
  }, [noParentId]);

  const handleClickCategory = useCallback(
    (_evt, { id, checked }) => {
      const term = categories.find((category) => category.id === id);

      // find the already selected slugs + update those.
      setSelectedTaxonomySlugs(taxonomy, (currentTerms = []) => {
        const index = currentTerms.findIndex((slug) => slug === term.slug);
        // add if term doesn't exist
        if (checked && index === -1) {
          return [...currentTerms, term.slug];
        }

        // remove if term exists
        if (!checked && index > -1) {
          return [
            ...currentTerms.slice(0, index),
            ...currentTerms.slice(index + 1),
          ];
        }

        return currentTerms;
      });
    },
    [categories, setSelectedTaxonomySlugs, taxonomy]
  );

  const handleToggleNewCategory = useCallback(() => {
    setShowAddNewCategory((currentValue) => !currentValue);
    resetInputs();
  }, [resetInputs]);

  const handleChangeNewCategoryName = useCallback((evt) => {
    setNewCategoryName(evt.target.value);
  }, []);

  const handleSubmit = useCallback(
    (evt) => {
      evt.preventDefault();

      const parentValue = selectedParent === noParentId ? 0 : selectedParent;
      createTerm(taxonomy, newCategoryName, parentValue);
      setShowAddNewCategory(false);
      resetInputs();
    },
    [
      createTerm,
      newCategoryName,
      noParentId,
      resetInputs,
      selectedParent,
      taxonomy,
    ]
  );

  const handleParentSelect = useCallback(
    (_evt, menuItem) => setSelectedParent(menuItem),
    []
  );

  return (
    <ContentArea>
      <ContentHeading>{taxonomy.labels.name}</ContentHeading>
      <HierarchicalInput
        label={taxonomy.labels.search_items}
        options={categories}
        onChange={handleClickCategory}
        noOptionsText={taxonomy.labels.not_found}
      />
      {showAddNewCategory ? (
        <AddNewCategoryForm onSubmit={handleSubmit}>
          <Input
            autoFocus
            name={taxonomy.labels.new_item_name}
            label={taxonomy.labels.new_item_name}
            value={newCategoryName}
            onChange={handleChangeNewCategoryName}
          />
          <Label htmlFor={dropdownId}>{taxonomy.labels.parent_item}</Label>
          <DropDown
            id={dropdownId}
            ariaLabel={taxonomy.labels.parent_item}
            options={dropdownCategories}
            selectedValue={selectedParent}
            onMenuItemClick={handleParentSelect}
          />
          <ButtonContainer>
            <AddNewCategoryButton
              disabled={!newCategoryName.length}
              type="submit"
            >
              {taxonomy.labels.add_new_item}
            </AddNewCategoryButton>
            <AddNewCategoryButton
              aria-expanded
              onClick={handleToggleNewCategory}
            >
              {__('Cancel', 'web-stories')}
            </AddNewCategoryButton>
          </ButtonContainer>
        </AddNewCategoryForm>
      ) : (
        <LinkButton aria-expanded={false} onClick={handleToggleNewCategory}>
          {taxonomy.labels.add_new_item}
        </LinkButton>
      )}
    </ContentArea>
  );
}

HierarchicalTermSelector.propTypes = {
  noParentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  taxonomy: TaxonomyPropType,
};

export default HierarchicalTermSelector;
