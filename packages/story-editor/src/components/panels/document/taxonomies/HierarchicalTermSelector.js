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
import styled from 'styled-components';
import { useCallback, useMemo, useState } from '@web-stories-wp/react';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { HierarchicalInput } from '../../../form';
import { useTaxonomy } from '../../../../app/taxonomy';
import { ContentHeading, TaxonomyPropType } from './shared';

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

const AddNewCategoryArea = styled.div`
  margin: 24px 0 16px;
`;

const ButtonContainer = styled.div`
  display: flex;
  column-gap: 8px;
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

function HierarchicalTermSelector({ taxonomy }) {
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

  // Categories to
  const categories = useMemo(() => {
    if (termCache[taxonomy.rest_base]) {
      return Object.values(termCache[taxonomy.rest_base]).map((category) => {
        const formattedCategory = { ...category };
        formattedCategory.value = formattedCategory.id;
        formattedCategory.label = formattedCategory.slug;
        formattedCategory.checked = selectedSlugs[taxonomy.rest_base].includes(
          category.slug
        );

        return formattedCategory;
      });
    }

    return [];
  }, [selectedSlugs, taxonomy, termCache]);

  const [showAddNewCategory, setShowAddNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedParent, setSelectedParent] = useState();
  const dropdownId = useMemo(uuidv4, []);

  const resetInputs = useCallback(() => {
    setNewCategoryName('');
    setSelectedParent();
  }, []);

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
  }, []);

  const handleChangeNewCategoryName = useCallback((evt) => {
    setNewCategoryName(evt.target.value);
  }, []);

  const handleAddCategory = useCallback(() => {
    createTerm(taxonomy, newCategoryName, selectedParent);
    setShowAddNewCategory(false);
    resetInputs();
  }, [createTerm, newCategoryName, resetInputs, selectedParent, taxonomy]);

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
      />
      {showAddNewCategory ? (
        <AddNewCategoryArea>
          <Input
            label={taxonomy.labels.new_item_name}
            value={newCategoryName}
            onChange={handleChangeNewCategoryName}
          />
          <Label htmlFor={dropdownId}>{taxonomy.labels.parent_item}</Label>
          <DropDown
            id={dropdownId}
            ariaLabel={taxonomy.labels.parent_item}
            placeholder={taxonomy.labels.parent_item}
            options={categories}
            selectedValue={selectedParent}
            onMenuItemClick={handleParentSelect}
          />
          <ButtonContainer>
            <AddNewCategoryButton
              disabled={!newCategoryName.length}
              onClick={handleAddCategory}
            >
              {__('Add Category', 'web-stories')}
            </AddNewCategoryButton>
            <AddNewCategoryButton onClick={handleToggleNewCategory}>
              {__('Cancel', 'web-stories')}
            </AddNewCategoryButton>
          </ButtonContainer>
        </AddNewCategoryArea>
      ) : (
        <LinkButton onClick={handleToggleNewCategory}>
          {taxonomy.labels.add_new_item}
        </LinkButton>
      )}
    </ContentArea>
  );
}

HierarchicalTermSelector.propTypes = {
  taxonomy: TaxonomyPropType,
};

export default HierarchicalTermSelector;
