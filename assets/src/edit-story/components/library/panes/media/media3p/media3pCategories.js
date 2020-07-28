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
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { ArrowDown } from '../../../../button/index';
import { ProviderType } from '../common/providerType';
import { useSnackbar } from '../../../../../app/snackbar';
import CategoryPill from './categoryPill';
// TODO(#2360) Category should be collapsible and expandable.
const CategorySection = styled.div`
  background-color: ${({ theme }) => theme.colors.bg.v3};
  min-height: 94px;
  padding: 30px 24px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// This hides the category pills unless expanded
const CategoryPillContainer = styled.div`
  height: ${(props) => (props.isExpanded ? 'auto' : '36px')};
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
`;

// Flips the button upside down when expanded;
const ExpandButton = styled(ArrowDown)`
  ${(props) => props.isExpanded && 'transform: matrix(1, 0, 0, -1, 0, 0);'};
`;

const Media3pCategories = ({
  providerType,
  categories,
  selectedCategoryId,
  selectCategory,
  deselectCategory,
  categoriesLoadingFailed,
  setCategoriesLoadingFailed,
}) => {
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (categoriesLoadingFailed) {
      let message = null;
      if (providerType === ProviderType.UNSPLASH) {
        message = __('Error loading categories from Unsplash', 'web-stories');
      } else {
        message = __('Error loading categories', 'web-stories');
      }
      showSnackbar({ message });
      setCategoriesLoadingFailed(false);
    }
  }, [
    providerType,
    showSnackbar,
    categoriesLoadingFailed,
    setCategoriesLoadingFailed,
  ]);

  const [isExpanded, setIsExpanded] = useState(false);
  return categories.length ? (
    <CategorySection aria-expanded={isExpanded}>
      <CategoryPillContainer isExpanded={isExpanded} role="tablist">
        {categories.map((e) => {
          const selected = e.id === selectedCategoryId;
          return (
            <CategoryPill
              isSelected={selected}
              key={e.id}
              title={e.displayName}
              onClick={() =>
                selected ? deselectCategory() : selectCategory(e.id)
              }
            />
          );
        })}
      </CategoryPillContainer>
      <ExpandButton
        onClick={() => setIsExpanded(!isExpanded)}
        isExpanded={isExpanded}
      />
    </CategorySection>
  ) : null;
};

Media3pCategories.propTypes = {
  providerType: PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  selectedCategoryId: PropTypes.string,
  selectCategory: PropTypes.func,
  deselectCategory: PropTypes.func,
  categoriesLoadingFailed: PropTypes.bool.isRequired,
  setCategoriesLoadingFailed: PropTypes.func.isRequired,
};

export default Media3pCategories;
