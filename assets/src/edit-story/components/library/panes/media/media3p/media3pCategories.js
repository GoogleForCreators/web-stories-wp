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
import styled, { css } from 'styled-components';
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

const CategorySection = styled.div`
  background-color: ${({ theme }) => rgba(theme.colors.bg.workspace, 0.8)};
  padding: 16px 12px 30px 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 0 auto;
  position: relative;

  ${({ hasCategories }) =>
    !hasCategories &&
    css`
      min-height: 104px;
      max-height: 104px;
    `}
`;

// This hides the category pills unless expanded
const CategoryPillContainer = styled.div`
  height: 36px;
  overflow: hidden;
  transition: height 0.2s;
`;

const CategoryPillInnerContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
  transition: transform 0.2s;
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
    return categories.map((e, i) => {
      const selected = e.id === selectedCategoryId;
      return (
        <CategoryPill
          index={i}
          isSelected={selected}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          key={e.id}
          categoryId={e.id}
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

  const containerRef = useRef();
  const innerContainerRef = useRef();

  const [focusedRowOffset, setFocusedRowOffset] = useState(0);

  // Handles expand and contract animation.
  // We calculate the actual height of the categories list, and set its explicit
  // height if it's expanded, in order to have a CSS height transition.
  useLayoutEffect(() => {
    if (!containerRef.current || !innerContainerRef.current) {
      return;
    }
    if (!isExpanded) {
      containerRef.current.style.height = '36px';
    } else {
      containerRef.current.style.height = `${innerContainerRef.current.offsetHeight}px`;
      setFocusedRowOffset(0);
    }
  }, [containerRef, innerContainerRef, isExpanded]);

  // Handles setting which row will be seen, by manipulating translateY.
  useLayoutEffect(() => {
    if (!innerContainerRef.current) {
      return;
    }
    const categoryPills = Array.from(
      innerContainerRef.current.querySelectorAll('.categoryPill')
    );
    const selectedCategoryPill = selectedCategoryId
      ? categoryPills.find((p) => p.dataset.categoryId == selectedCategoryId)
      : null;
    const selectedCategoryPillOffsetTop = selectedCategoryPill?.offsetTop || 0;

    if (selectedCategoryPillOffsetTop) {
      setFocusedRowOffset(selectedCategoryPillOffsetTop);
    }
  }, [innerContainerRef, isExpanded, selectedCategoryId]);

  // Handles fading category rows in and out depending on the selected category.
  useLayoutEffect(() => {
    if (!innerContainerRef.current) {
      return;
    }
    const categoryPills = Array.from(
      innerContainerRef.current.querySelectorAll('.categoryPill')
    );
    const selectedCategoryPill = selectedCategoryId
      ? categoryPills.find((p) => p.dataset.categoryId == selectedCategoryId)
      : null;
    const selectedCategoryPillOffsetTop = selectedCategoryPill?.offsetTop || 0;

    for (let categoryPill of categoryPills) {
      const isSameRow =
        selectedCategoryPill &&
        categoryPill.offsetTop == selectedCategoryPillOffsetTop;
      if (selectedCategoryPill && !isSameRow) {
        categoryPill.classList.add('invisible');
      } else {
        categoryPill.classList.remove('invisible');
      }
    }
  }, [innerContainerRef, isExpanded, selectedCategoryId]);

  return (
    <CategorySection hasCategories={Boolean(categories.length)}>
      {categories.length ? (
        <>
          <CategoryPillContainer
            id="category-pill-container"
            ref={containerRef}
            isExpanded={isExpanded}
            role="tablist"
          >
            <CategoryPillInnerContainer
              ref={innerContainerRef}
              style={{ transform: `translateY(-${focusedRowOffset}px` }}
            >
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
