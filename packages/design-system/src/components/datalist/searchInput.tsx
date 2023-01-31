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
import { forwardRef, useCallback } from '@googleforcreators/react';
import type { ForwardedRef, KeyboardEvent } from 'react';
import styled, { css } from 'styled-components';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { themeHelpers } from '../../theme';
import { Magnifier, Cross } from '../../icons';
import { Button, ButtonVariant } from '../button';
import { noop } from '../../utils';
import type { SearchInputProps } from './types';

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
  width: 30px;
  padding: 0;
  margin: 0;
  transform: translateY(-50%);
  background-color: transparent;
  border: none;

  > svg {
    height: 100%;
    width: auto;
    color: ${({ theme }) => theme.colors.fg.primary};
    fill: ${({ theme }) => theme.colors.fg.primary};
  }
`;

const SearchIconContainer = styled.div`
  ${inputIconStyles}
  left: 0;
  height: 28px;
`;

const ClearButton = styled(Button).attrs({ variant: ButtonVariant.Icon })`
  ${inputIconStyles};
  right: 0;
  height: 20.5px;
  opacity: 0.4;
`;

const Input = styled.input.attrs({
  type: 'search',
  role: 'combobox',
  ['aria-autocomplete']: 'list',
})`
  width: 100%;
  padding: 6px 20px 6px 30px;
  border-radius: ${({ theme }) => theme.borders.radius.small};
  background: ${({ theme }) => theme.colors.bg.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.defaultActive};
  color: ${({ theme }) => theme.colors.fg.primary};
  ${themeHelpers.expandTextPreset(
    ({ paragraph }, { Small }) => paragraph[Small]
  )}

  &::-ms-clear {
    display: none;
  }

  &:placeholder-shown {
    text-overflow: ellipsis;
  }
  &::-webkit-input-placeholder {
    /* Chrome/Opera/Safari */
    text-overflow: ellipsis;
  }
  &::-moz-placeholder {
    /* Firefox 19+ */
    text-overflow: ellipsis;
  }
  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button,
  &::-webkit-search-results-button,
  &::-webkit-search-results-decoration {
    appearance: none;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.border.focus};
  }
`;

const MAX_INPUT_SIZE = 35;

const SearchInput = forwardRef(function SearchInput(
  {
    isExpanded,
    onClose,
    value,
    onChange,
    focusFontListFirstOption = noop,
    placeholder = __('Search', 'web-stories'),
    ...rest
  }: SearchInputProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const handleKeyPress = useCallback(
    (evt: KeyboardEvent<HTMLInputElement>) => {
      evt.stopPropagation();

      const { key } = evt;

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
        placeholder={placeholder}
        size={Math.min(placeholder.length, MAX_INPUT_SIZE)}
        onChange={(evt) => onChange(evt.target.value)}
        aria-label={__('Search', 'web-stories')}
        {...rest}
      />
      <SearchIconContainer>
        <Magnifier />
      </SearchIconContainer>
      {value.trim().length > 0 && (
        <ClearButton onClick={() => onChange('')}>
          <Cross />
        </ClearButton>
      )}
    </SearchContainer>
  );
});

export default SearchInput;
