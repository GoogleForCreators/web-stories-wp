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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useCallback, useRef } from 'react';
/**
 * Internal dependencies
 */
import useRovingTabIndex from '../common/useRovingTabIndex';
import { useKeyDownEffect } from '../../../../keyboard';
import { pill } from './pill';

const PillContainer = styled.button`
  ${pill};
  cursor: pointer;
  margin-bottom: 12px;
  font-family: ${({ theme }) => theme.fonts.body2.family};
  border-color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.accent.primary : theme.colors.fg.gray24};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.fg.primary};
  user-select: none;
  background-clip: padding-box;
`;

PillContainer.propTypes = {
  isSelected: PropTypes.bool,
};

const CategoryPill = ({
  index,
  title,
  isSelected,
  isExpanded,
  setIsExpanded,
  onClick,
}) => {
  const ref = useRef();

  // useRovingTabIndex and useKeyDownEffect depend on 'isExpanded' to avoid
  // conflicting 'down' arrow handlers.
  useRovingTabIndex({ ref }, [isExpanded]);

  const expand = useCallback(() => setIsExpanded(true), [setIsExpanded]);
  useKeyDownEffect(ref, !isExpanded ? 'down' : [], expand, [
    isExpanded,
    expand,
  ]);

  return (
    <PillContainer
      ref={ref}
      // The first or selected category will be in focus for roving
      // (arrow-based) navigation initially.
      tabIndex={index === 0 || isSelected ? 0 : -1}
      isSelected={isSelected}
      onClick={onClick}
      role="tab"
      aria-selected={isSelected}
      data-testid="mediaCategory"
    >
      {title}
    </PillContainer>
  );
};

CategoryPill.propTypes = {
  index: PropTypes.number,
  isSelected: PropTypes.bool,
  isExpanded: PropTypes.bool,
  setIsExpanded: PropTypes.func,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default CategoryPill;
