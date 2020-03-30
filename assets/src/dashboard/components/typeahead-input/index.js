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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useCallback, useMemo, useRef, useState } from 'react';

/**
 * Internal dependencies
 */
import { ReactComponent as SearchIcon } from '../../icons/search.svg';
import { ReactComponent as CloseIcon } from '../../icons/close.svg';
import useFocusOut from '../../utils/useFocusOut';
import { TypeaheadOptions } from '../';

const SearchContainer = styled.div`
  width: 272px;
  position: static;
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme, isOpen }) =>
    isOpen ? theme.border.expandedTypeaheadRadius : 'none'};
  border: none;
  box-shadow: ${({ theme, isOpen }) =>
    isOpen ? theme.boxShadow.expandedTypeahead : 'none'};
`;
SearchContainer.propTypes = {
  isOpen: PropTypes.bool,
};

const InputContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 48px;
  padding-top: 15px;
  padding-bottom: 15px;
  padding-left: 19px;
  border-radius: ${({ theme, isOpen }) =>
    isOpen ? 'none' : theme.border.typeaheadRadius};
  border: none;
  border-bottom: ${({ theme, isOpen }) =>
    isOpen && `1px solid ${theme.colors.gray50}`};
  color: ${({ theme }) => theme.colors.gray500};
  background-color: ${({ theme, isOpen }) =>
    isOpen ? theme.colors.white : theme.colors.gray25};
`;
InputContainer.propTypes = {
  isOpen: PropTypes.bool,
};

const StyledInput = styled.input`
  align-self: center;
  border: none;
  background-color: transparent;
  text-overflow: ellipsis;
  padding: 0 11.95px;
  margin: auto 0;
  height: 100%;
  font-family: ${({ theme }) => theme.fonts.typeaheadInput.family};
  font-size: ${({ theme }) => theme.fonts.typeaheadInput.size};
  line-height: ${({ theme }) => theme.fonts.typeaheadInput.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.typeaheadInput.letterSpacing};
  font-weight: ${({ theme }) => theme.fonts.typeaheadInput.weight};
  color: ${({ theme }) => theme.colors.gray500};

  &:disabled {
    cursor: default;
  }
`;

const IconContainer = styled.span`
  margin: auto 0;
  width: 17.05px;
  height: 17.05px;
  color: ${({ theme }) => theme.colors.gray300};
`;

const ClearInputButton = styled.button`
  align-self: flex-end;
  border: none;
  background-color: transparent;
  margin: auto 19px auto auto;
  width: 13.18px;
  height: 13.18px;
  padding: 0;
  color: ${({ theme }) => theme.colors.gray600};
  cursor: pointer;
`;

const TypeaheadInput = ({
  inputId,
  items,
  className,
  disabled,
  onChange,
  maxItemsVisible = 5,
  placeholder,
  value = '',
  ariaLabel,
  isFiltering,
  ...rest
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const isMenuOpen = useMemo(() => {
    return showMenu && items.length > 0 && inputValue.length > 0;
  }, [items, showMenu, inputValue]);

  const filteredItems = useMemo(() => {
    if (!Boolean(isFiltering)) {
      return items;
    }
    return items.filter((item) => {
      const lowerInputValue = inputValue.toLowerCase();

      return (
        item.label.toLowerCase().includes(lowerInputValue) ||
        item.value.toLowerCase().includes(lowerInputValue)
      );
    });
  }, [items, inputValue, isFiltering]);

  const searchRef = useRef();

  const handleFocusOut = useCallback(() => {
    setShowMenu(false);
  }, []);

  useFocusOut(searchRef, handleFocusOut);

  const handleInputChange = (item) => {
    setInputValue(item.label);
    onChange(item.value);
  };

  const handleMenuItemSelect = (item) => {
    if (!item.value) {
      return;
    }
    handleInputChange(item);
    setShowMenu(false);
  };

  const handleInputClear = () => {
    handleInputChange({ label: '', value: '' });
    setShowMenu(false);
  };

  return (
    <SearchContainer
      ref={searchRef}
      className={className}
      {...rest}
      isOpen={isMenuOpen}
    >
      <InputContainer isOpen={isMenuOpen}>
        <IconContainer>
          <SearchIcon />
        </IconContainer>
        <label aria-label={ariaLabel} htmlFor={inputId} />
        <StyledInput
          autoComplete="off"
          type="text"
          id={inputId}
          name={inputId}
          disabled={disabled}
          isOpen={isMenuOpen}
          value={inputValue}
          onFocus={() => setShowMenu(true)}
          onChange={({ target }) => {
            handleInputChange({ label: target.value, value: target.value });
          }}
          placeholder={placeholder}
        />
        {inputValue.length > 0 && !Boolean(isMenuOpen) && (
          <ClearInputButton
            onClick={handleInputClear}
            aria-label={__('Clear Input', 'web-stories')}
          >
            <CloseIcon />
          </ClearInputButton>
        )}
      </InputContainer>

      <TypeaheadOptions
        isOpen={isMenuOpen}
        items={filteredItems}
        maxItemsVisible={maxItemsVisible}
        onSelect={filteredItems && handleMenuItemSelect}
      />
    </SearchContainer>
  );
};

TypeaheadInput.propTypes = {
  inputId: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
    })
  ).isRequired,

  ariaLabel: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  isFiltering: PropTypes.bool,
  maxItemsVisible: PropTypes.number,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

export default TypeaheadInput;
