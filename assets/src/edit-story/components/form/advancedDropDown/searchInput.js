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
import { forwardRef, useCallback } from 'react';
import { rgba } from 'polished';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ReactComponent as CloseIcon } from '../../../icons/close.svg';
import { ReactComponent as SearchIcon } from '../../../icons/search.svg';

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`;

const inputIconStyles = css`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 50%;
  height: 14px;
  width: 30px;
  padding: 0;
  margin: 0;
  transform: translateY(-50%);
  background-color: transparent;
  border: none;

  > svg {
    height: 100%;
    width: auto;
    color: ${({ theme }) => theme.colors.fg.white};
    fill: ${({ theme }) => theme.colors.fg.white};
  }
`;

const SearchIconContainer = styled.div`
  ${inputIconStyles}
  left: 0;
`;

const ClearButton = styled.button`
  ${inputIconStyles}
  right: 0;
  height: 100%;
  opacity: 0.4;
  cursor: pointer;

  > svg {
    height: 10px;
  }
`;

const Input = styled.input.attrs({
  type: 'search',
  role: 'combobox',
  ['aria-autocomplete']: 'list',
})`
  width: 100%;
  padding: 6px 20px 6px 30px;
  border-radius: ${({ theme }) => theme.border.radius.default};
  background: ${({ theme }) => theme.colors.input};
  border: 1px solid ${({ theme }) => rgba(theme.colors.bg.white, 0.24)};
  color: ${({ theme }) => theme.colors.fg.white};
  font-size: ${({ theme }) => theme.fonts.input.size};
  line-height: ${({ theme }) => theme.fonts.input.lineHeight};
  font-weight: ${({ theme }) => theme.fonts.input.weight};
  font-family: ${({ theme }) => theme.fonts.input.family};

  &::-ms-clear {
    display: none;
  }

  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button,
  &::-webkit-search-results-button,
  &::-webkit-search-results-decoration {
    appearance: none;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.accent.secondary};
  }
`;

const SearchInput = forwardRef(function SearchInput(
  {
    isExpanded,
    onClose,
    value,
    onChange,
    focusFontListFirstOption = () => {},
    ...rest
  },
  ref
) {
  const handleKeyPress = useCallback(
    ({ key }) => {
      if (key === 'Escape') {
        onClose();
      } else if (key === 'ArrowDown') {
        focusFontListFirstOption();
      }
    },
    [onClose, focusFontListFirstOption]
  );

  return (
    <SearchContainer>
      <Input
        ref={ref}
        aria-expanded={isExpanded}
        value={value}
        onKeyDown={handleKeyPress}
        placeholder={__('Search', 'web-stories')}
        onChange={onChange}
        {...rest}
      />
      <SearchIconContainer>
        <SearchIcon />
      </SearchIconContainer>
      {value.trim().length > 0 && (
        <ClearButton onClick={() => onChange({ target: { value: '' } })}>
          <CloseIcon />
        </ClearButton>
      )}
    </SearchContainer>
  );
});

SearchInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  isExpanded: PropTypes.bool,
  onClose: PropTypes.func,
  focusFontListFirstOption: PropTypes.func,
  listId: PropTypes.string,
};

export default SearchInput;
