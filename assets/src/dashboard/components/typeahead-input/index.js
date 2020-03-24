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
import { useState, useRef, useCallback, useMemo } from 'react';

/**
 * Internal dependencies
 */
import useFocusOut from '../../utils/useFocusOut';
import { TypeaheadOptions } from '../';
import { ReactComponent as SearchIcon } from '../../icons/search.svg';
import { ReactComponent as CloseIcon } from '../../icons/close.svg';

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
`;

const TypeaheadInput = ({
  inputId,
  items,
  className,
  disabled,
  onChange,
  maxItemsVisible = 5,
  placeholder,
  value,
  ariaLabel,
  ...rest
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const [inputValue, setInputValue] = useState(value);

  const menuIsOpen = useMemo(() => {
    return showMenu && items.length > 0;
  }, [items, showMenu]);

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
    handleInputChange({ label: '', value: false });
    setShowMenu(false);
  };

  return (
    <SearchContainer
      ref={searchRef}
      className={className}
      {...rest}
      isOpen={menuIsOpen}
    >
      <form autoComplete="off">
        <InputContainer isOpen={menuIsOpen}>
          <IconContainer>
            <SearchIcon />
          </IconContainer>
          <label aria-label={ariaLabel} htmlFor={inputId} />
          <StyledInput
            type="text"
            id={inputId}
            disabled={disabled}
            isOpen={menuIsOpen}
            value={inputValue}
            onFocus={() => setShowMenu(true)}
            onBlur={() => setShowMenu(false)}
            onChange={({ target }) => {
              handleInputChange({ label: target.value, value: target.value });
            }}
            onClick={() => setShowMenu(!showMenu)}
            placeholder={placeholder}
          />
          {inputValue.length > 0 && !Boolean(menuIsOpen) && (
            <ClearInputButton
              onClick={handleInputClear}
              ariaLabel={'Clear Input'}
            >
              <CloseIcon />
            </ClearInputButton>
          )}
        </InputContainer>

        <TypeaheadOptions
          isOpen={menuIsOpen}
          items={items}
          maxItemsVisible={maxItemsVisible}
          onSelect={items && handleMenuItemSelect}
        />
      </form>
    </SearchContainer>
  );
};

TypeaheadInput.propTypes = {
  inputId: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,

  ariaLabel: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  maxItemsVisible: PropTypes.number,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string,
};
export default TypeaheadInput;
