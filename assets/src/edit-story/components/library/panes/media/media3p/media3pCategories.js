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
import { useState } from 'react';
import PropTypes from 'prop-types';
import { rgba } from 'polished';

/**
 * Internal dependencies
 */
import { ArrowDown } from '../../../../button/index';
import CategoryPill from './categoryPill';

// Pills have a margin of 4, so the l/r padding is 24-4=20.
const CategorySection = styled.div`
  background-color: ${({ theme }) => rgba(theme.colors.bg.workspace, 0.8)};
  min-height: 94px;
  padding: 16px 32px 30px 32px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 0 auto;
  position: relative;
`;

// This hides the category pills unless expanded
const CategoryPillContainer = styled.div`
  height: ${(props) => (props.isExpanded ? 'auto' : '36px')};
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
`;

// Flips the button upside down when expanded;
// Important: the visibily is 'inherit' when props.visible because otherwise
// it gets shown even when the provider is not the selectedProvider!
const ExpandButton = styled(ArrowDown)`
  display: flex;
  position: absolute;
  bottom: -12px;
  background: ${({ theme }) => theme.colors.fg.gray16};
  border-radius: 50px;
  min-width: 32px;
  min-height: 32px;
  max-width: 32px;
  max-height: 32px;
  width: 32px;
  height: 32px;
  ${({ isExpanded }) => isExpanded && 'transform: matrix(1, 0, 0, -1, 0, 0);'}
  visibility: ${({ visible }) => (visible ? 'inherit' : 'hidden')};
  align-self: center;
  justify-content: center;
  align-items: center;
`;

const Media3pCategories = ({
  categories,
  selectedCategoryId,
  selectCategory,
  deselectCategory,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  function renderCategories() {
    return (selectedCategoryId
      ? [categories.find((e) => e.id === selectedCategoryId)]
      : categories
    ).map((e) => {
      const selected = e.id === selectedCategoryId;
      return (
        <CategoryPill
          isSelected={selected}
          key={e.id}
          title={e.displayName}
          onClick={() => {
            if (selected) {
              deselectCategory();
            } else {
              setIsExpanded(false);
              selectCategory(e.id);
            }
          }}
        />
      );
    });
  }

  return categories.length ? (
    <CategorySection aria-expanded={isExpanded}>
      <CategoryPillContainer isExpanded={isExpanded} role="tablist">
        {renderCategories()}
      </CategoryPillContainer>
      <ExpandButton
        onClick={() => setIsExpanded(!isExpanded)}
        isExpanded={isExpanded}
        visible={!selectedCategoryId}
      />
    </CategorySection>
  ) : null;
};

Media3pCategories.propTypes = {
  categories: PropTypes.array.isRequired,
  selectedCategoryId: PropTypes.string,
  selectCategory: PropTypes.func,
  deselectCategory: PropTypes.func,
};

export default Media3pCategories;
