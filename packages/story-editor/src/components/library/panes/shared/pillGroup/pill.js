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
import PropTypes from 'prop-types';
import { rgba } from 'polished';

/**
 * Internal dependencies
 */
import { PILL_HEIGHT } from './constants';

const PillContainer = styled.button`
  border: 1px solid transparent;
  margin-right: 12px;
  padding: 7px 16px 8px;
  height: ${PILL_HEIGHT}px;
  border-radius: 18px;
  font-size: ${({ theme }) =>
    theme.DEPRECATED_THEME.fonts.paragraph.small.size};
  line-height: ${({ theme }) =>
    theme.DEPRECATED_THEME.fonts.paragraph.small.lineHeight};
  user-select: none;
  cursor: pointer;
  margin-bottom: 12px;
  font-family: ${({ theme }) =>
    theme.DEPRECATED_THEME.fonts.paragraph.small.family};
  border-color: ${({ theme, isSelected }) =>
    isSelected ? 'transparent' : theme.DEPRECATED_THEME.colors.fg.gray16};
  background-color: ${({ theme, isSelected }) =>
    isSelected
      ? rgba(theme.DEPRECATED_THEME.colors.bg.divider, 0.04)
      : 'transparent'};
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.primary};
  background-clip: padding-box;
  transition: opacity 0.2s;
  &.invisible {
    opacity: 0;
  }
`;

function Pill({ itemRef, children, isSelected, onClick, index }) {
  return (
    <PillContainer
      ref={itemRef}
      // @todo Get rid of data-* values.
      data-testid="pill"
      role="option"
      aria-selected={isSelected}
      // The first or selected category will be in focus for roving
      // (arrow-based) navigation initially.
      tabIndex={index === 0 || isSelected ? 0 : -1}
      isSelected={isSelected}
      onClick={onClick}
    >
      {children}
    </PillContainer>
  );
}

Pill.propTypes = {
  index: PropTypes.number,
  isSelected: PropTypes.bool,
  itemRef: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

export default Pill;
