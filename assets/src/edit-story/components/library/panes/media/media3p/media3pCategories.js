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
import { useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { rgba } from 'polished';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ArrowDown } from '../../../../button';
import CategoryPill from './categoryPill';
import { PILL_HEIGHT } from './pill';

const CATEGORY_TOP_MARGIN = 16;
const CATEGORY_BOTTOM_MARGIN = 30;
const CATEGORY_COLLAPSED_FULL_HEIGHT =
  PILL_HEIGHT + CATEGORY_TOP_MARGIN + CATEGORY_BOTTOM_MARGIN;

const CategorySection = styled.div`
  height: ${CATEGORY_COLLAPSED_FULL_HEIGHT}px;
  min-height: ${CATEGORY_COLLAPSED_FULL_HEIGHT}px;
  background-color: ${({ theme }) => rgba(theme.colors.bg.workspace, 0.8)};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 0 1 auto;
  position: relative;
  transition: height 0.2s, min-height 0.2s;
`;

// This hides the category pills unless expanded
const CategoryPillContainer = styled.div`
  overflow: hidden;
  margin: ${CATEGORY_TOP_MARGIN}px 12px ${CATEGORY_BOTTOM_MARGIN}px 24px;
`;

const CategoryPillInnerContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

// Flips the button upside down when expanded;
// Important: the visibily is 'inherit' when props.visible because otherwise
// it gets shown even when the provider is not the selectedProvider!
const ExpandButton = styled(ArrowDown)`
  display: flex;
  position: absolute;
  bottom: -16px;
  background: ${({ theme }) => theme.colors.fg.gray16};
  max-height: none;
  width: 32px;
  height: 32px;
  border-radius: 16px;
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
    ).map((e, i) => {
      const selected = e.id === selectedCategoryId;
      return (
        <CategoryPill
          index={i}
          isSelected={selected}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
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

  const categorySectionRef = useRef();
  const innerContainerRef = useRef();

  // We calculate the actual height of the categories list, and set its explicit
  // height if it's expanded, in order to have a CSS height transition.
  useLayoutEffect(() => {
    if (!categorySectionRef.current || !innerContainerRef.current) {
      return;
    }
    let height;
    if (!isExpanded) {
      height = `${CATEGORY_COLLAPSED_FULL_HEIGHT}px`;
    } else {
      height = `${
        innerContainerRef.current.offsetHeight +
        CATEGORY_TOP_MARGIN +
        CATEGORY_BOTTOM_MARGIN
      }px`;
    }
    categorySectionRef.current.style.height = height;
    categorySectionRef.current.style.minHeight = height;
  }, [categorySectionRef, innerContainerRef, isExpanded]);

  return (
    <CategorySection
      ref={categorySectionRef}
      hasCategories={Boolean(categories.length)}
    >
      {categories.length ? (
        <>
          <CategoryPillContainer
            id="category-pill-container"
            isExpanded={isExpanded}
            role="tablist"
          >
            <CategoryPillInnerContainer ref={innerContainerRef}>
              {renderCategories()}
            </CategoryPillInnerContainer>
          </CategoryPillContainer>
          <ExpandButton
            data-testid="category-expand-button"
            onClick={() => setIsExpanded(!isExpanded)}
            visible={!selectedCategoryId}
            isExpanded={isExpanded}
            aria-controls="category-pill-container"
            aria-expanded={isExpanded}
            aria-label={__('Expand', 'web-stories')}
          />
        </>
      ) : null}
    </CategorySection>
  );
};

Media3pCategories.propTypes = {
  categories: PropTypes.array.isRequired,
  selectedCategoryId: PropTypes.string,
  selectCategory: PropTypes.func,
  deselectCategory: PropTypes.func,
};

export default Media3pCategories;
