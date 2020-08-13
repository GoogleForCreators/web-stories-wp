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

/**
 * Internal dependencies
 */
import { ArrowDown } from '../../../../button/index';
import CategoryPill from './categoryPill';

// Pills have a margin of 4, so the l/r padding is 24-4=20.
const CategorySection = styled.div`
  background-color: ${({ theme }) => theme.colors.bg.v3};
  min-height: 94px;
  padding: 30px 20px 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 0 auto;
`;

// This hides the category pills unless expanded
const CategoryPillContainer = styled.div`
  height: 36px;
  overflow: hidden;
  transition: height 0.2s;
`;

const CategoryPillInnerContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

// Flips the button upside down when expanded;
// Important: the visibily is 'inherit' when props.visible because otherwise
// it gets shown even when the provider is not the selectedProvider!
const ExpandButton = styled(ArrowDown)`
  ${(props) => props.isExpanded && 'transform: matrix(1, 0, 0, -1, 0, 0);'};
  visibility: ${(props) => (props.visible ? 'inherit' : 'hidden')};
  align-self: center;
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

  const containerRef = useRef();
  const innerContainerRef = useRef();

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
    }
  }, [containerRef, innerContainerRef, isExpanded]);

  return categories.length ? (
    <CategorySection aria-expanded={isExpanded}>
      <CategoryPillContainer
        ref={containerRef}
        isExpanded={isExpanded}
        role="tablist"
      >
        <CategoryPillInnerContainer ref={innerContainerRef}>
          {renderCategories()}
        </CategoryPillInnerContainer>
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
