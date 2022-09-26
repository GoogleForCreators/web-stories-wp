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
import { __, _x, sprintf } from '@googleforcreators/i18n';
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
  useLiveRegion,
} from '@googleforcreators/design-system';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { HierarchicalInput, makeFlatOptionTree } from '../../../form';
import { useTaxonomy } from '../../../../app/taxonomy';
import { ContentHeading, TaxonomyPropType, LinkButton } from './shared';

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

function HierarchicalTermSelector({
  noParentId = NO_PARENT_VALUE,
  taxonomy,
  canCreateTerms,
}) {
  const { createTerm, termCache, terms, setTerms } = useTaxonomy(
    ({ state: { termCache, terms }, actions: { createTerm, setTerms } }) => ({
      createTerm,
      setTerms,
      termCache,
      terms,
    })
  );

  const categories = useMemo(() => {
    if (termCache?.[taxonomy.restBase]) {
      return Object.values(termCache[taxonomy.restBase]).map((category) => ({
        id: category.id,
        parent: category.parent,
        value: category.id,
        label: category.name,
        checked: terms[taxonomy.restBase]?.includes(category.id),
        slug: category.slug,
      }));
    }

    return [];
  }, [taxonomy, termCache, terms]);

  const [showAddNewCategory, setShowAddNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedParent, setSelectedParent] = useState(noParentId);
  const dropdownId = useMemo(uuidv4, []);
  const [hasFocus, setHasFocus] = useState(false);
  const formRef = useRef();
  const toggleRef = useRef();
  const [toggleFocus, setToggleFocus] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleInputChange = useCallback((value) => setSearchText(value), []);
  const speak = useLiveRegion('assertive');

  const resetInputs = useCallback(() => {
    setNewCategoryName('');
    setSelectedParent(noParentId);
  }, [noParentId]);

  const handleClickCategory = useCallback(
    (_evt, { id, checked }) => {
      const term = categories.find((category) => category.id === id);

      // find the already selected slugs + update those.
      setTerms(taxonomy, (currentTerms = []) => {
        const index = currentTerms.findIndex((termId) => termId === term.id);
        // add if term doesn't exist
        if (checked && index === -1) {
          return [...currentTerms, term.id];
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
    [categories, setTerms, taxonomy]
  );

  const handleToggleNewCategory = useCallback(() => {
    setShowAddNewCategory(!showAddNewCategory);
    resetInputs();
    setHasFocus(!showAddNewCategory);
    setToggleFocus(showAddNewCategory);
  }, [resetInputs, showAddNewCategory]);

  const handleChangeNewCategoryName = useCallback((evt) => {
    setNewCategoryName(evt.target.value);
  }, []);

  const selectedParentSlug = useMemo(
    () => categories.find((category) => category.id === selectedParent)?.slug,
    [selectedParent, categories]
  );

  const handleSubmit = useCallback(
    (evt) => {
      evt.preventDefault();

      const parentValue = {
        id: selectedParent === noParentId ? 0 : selectedParent,
        slug: selectedParentSlug,
      };
      createTerm(taxonomy, newCategoryName, parentValue, true);
      speak(
        sprintf(
          /* Translators: %s: Taxonomy label name. */
          __('%s added.', 'web-stories'),
          taxonomy.labels.singular_name
        )
      );
      setShowAddNewCategory(false);
      resetInputs();
      setToggleFocus(showAddNewCategory);
    },
    [
      createTerm,
      speak,
      newCategoryName,
      noParentId,
      resetInputs,
      selectedParent,
      showAddNewCategory,
      taxonomy,
      selectedParentSlug,
    ]
  );
  const handleParentSelect = useCallback(
    (_evt, menuItem) => setSelectedParent(menuItem),
    []
  );

  useEffect(() => {
    const node = formRef.current;
    if (node) {
      const handleEnter = (evt) => {
        if (evt.key === 'Enter') {
          handleSubmit(evt);
        }
      };

      node.addEventListener('keypress', handleEnter);
      return () => {
        node.removeEventListener('keypress', handleEnter);
      };
    }
    return null;
  }, [handleSubmit, formRef]);

  useEffect(() => {
    if (toggleFocus) {
      toggleRef.current.focus();
    }
  }, [toggleFocus]);

  const orderedCategories = useMemo(
    () => makeFlatOptionTree(categories, searchText),
    [categories, searchText]
  );

  const dropdownCategories = useMemo(
    () =>
      [
        {
          value: NO_PARENT_VALUE,
          label: _x('None', 'parent taxonomy', 'web-stories'),
        },
      ]
        .concat(orderedCategories)
        .map(({ $level, label, ...opt }) => ({
          ...opt,
          label: `${Array.from({ length: $level }, () => '— ').join(
            ''
          )} ${label}`,
        })),
    [orderedCategories]
  );

  return (
    <ContentArea>
      <ContentHeading>{taxonomy.labels.name}</ContentHeading>
      <HierarchicalInput
        inputValue={searchText}
        onInputChange={handleInputChange}
        label={taxonomy.labels.searchItems}
        options={orderedCategories}
        onChange={handleClickCategory}
        noOptionsText={taxonomy.labels?.notFound}
      />
      {canCreateTerms ? (
        <>
          {!showAddNewCategory && (
            <LinkButton
              ref={toggleRef}
              aria-expanded={false}
              onClick={handleToggleNewCategory}
            >
              {taxonomy.labels.addNewItem}
            </LinkButton>
          )}
          {showAddNewCategory ? (
            <AddNewCategoryForm ref={formRef} onSubmit={handleSubmit}>
              <Input
                autoFocus
                name={taxonomy.labels.newItemName}
                label={taxonomy.labels.newItemName}
                value={newCategoryName}
                onChange={handleChangeNewCategoryName}
                hasFocus={hasFocus}
              />
              <Label htmlFor={dropdownId}>{taxonomy.labels.parentItem}</Label>
              <DropDown
                id={dropdownId}
                ariaLabel={taxonomy.labels.parentItem}
                options={dropdownCategories}
                selectedValue={selectedParent}
                onMenuItemClick={handleParentSelect}
              />
              <ButtonContainer>
                <AddNewCategoryButton
                  disabled={!newCategoryName.length}
                  type="submit"
                >
                  {taxonomy.labels.addNewItem}
                </AddNewCategoryButton>
                <AddNewCategoryButton
                  aria-expanded
                  onClick={handleToggleNewCategory}
                >
                  {__('Cancel', 'web-stories')}
                </AddNewCategoryButton>
              </ButtonContainer>
            </AddNewCategoryForm>
          ) : null}
        </>
      ) : null}
    </ContentArea>
  );
}

HierarchicalTermSelector.propTypes = {
  noParentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  taxonomy: TaxonomyPropType,
  canCreateTerms: PropTypes.bool,
};

export default HierarchicalTermSelector;
