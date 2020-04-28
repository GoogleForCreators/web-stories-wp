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
import TypeaheadOptions from '../typeaheadOptions';

const SearchContainer = styled.div`
  width: 272px;
  position: static;
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme, isOpen }) =>
    isOpen ? `${theme.expandedTypeahead.borderRadius}px` : 'none'};
  border: none;
  box-shadow: ${({ theme, isOpen }) =>
    isOpen ? theme.expandedTypeahead.boxShadow : 'none'};

  @media ${({ theme }) => theme.breakpoint.largeDisplayPhone} {
    width: ${({ isExpanded }) => (isExpanded ? '272px' : '48px')};
    transition: width 0.2s cubic-bezier(0.39, 0.575, 0.565, 1);
  }
`;
SearchContainer.propTypes = {
  isExpanded: PropTypes.bool,
  isOpen: PropTypes.bool,
};

const InputContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 48px;
  padding: 16px;
  align-items: center;
  border-radius: ${({ theme, isOpen }) =>
    isOpen ? 'none' : `${theme.typeahead.borderRadius}px`};
  border: none;
  border-bottom: ${({ theme, isOpen }) => isOpen && theme.borders.gray50};
  color: ${({ theme }) => theme.colors.gray500};
  background-color: ${({ theme, isOpen }) =>
    isOpen ? theme.colors.white : theme.colors.gray25};
`;
InputContainer.propTypes = {
  isOpen: PropTypes.bool,
};

const ControlVisibilityContainer = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: flex-start;

  @media ${({ theme }) => theme.breakpoint.largeDisplayPhone} {
    opacity: ${({ isExpanded }) => (isExpanded ? '1' : '0')};
    transition: opacity 0.2s cubic-bezier(0.39, 0.575, 0.565, 1);
  }
`;
ControlVisibilityContainer.propTypes = {
  isExpanded: PropTypes.bool,
};

const StyledInput = styled.input`
  align-self: center;
  border: none;
  background-color: transparent;
  text-overflow: ellipsis;
  padding: 0 12px;
  margin: auto 0;
  height: 100%;
  flex-grow: 1;
  font-family: ${({ theme }) => theme.fonts.typeaheadInput.family};
  font-size: ${({ theme }) => theme.fonts.typeaheadInput.size}px;
  line-height: ${({ theme }) => theme.fonts.typeaheadInput.lineHeight}px;
  letter-spacing: ${({ theme }) => theme.fonts.typeaheadInput.letterSpacing}em;
  font-weight: ${({ theme }) => theme.fonts.typeaheadInput.weight};
  color: ${({ theme }) => theme.colors.gray500};

  &:disabled {
    cursor: default;
  }

  @media ${({ theme }) => theme.breakpoint.largeDisplayPhone} {
    width: ${({ isExpanded }) => (isExpanded ? '100%' : '0')};
  }
`;
StyledInput.propTypes = {
  isExpanded: PropTypes.bool,
};

const SearchButton = styled.button`
  margin: 0;
  padding: 0;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.gray300};
  & > svg {
    width: 16px;
    height: 16px;
  }

  @media ${({ theme }) => theme.breakpoint.largeDisplayPhone} {
    color: ${({ theme }) => theme.colors.gray500};
  }
`;

const ClearInputButton = styled.button`
  align-self: flex-end;
  border: none;
  background-color: transparent;
  margin: auto 0;
  width: 14px;
  height: 14px;
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
  const [menuFocused, setMenuFocused] = useState(false);

  const [inputValue, setInputValue] = useState(value);

  const searchRef = useRef();
  const inputRef = useRef();

  const isMenuOpen = useMemo(() => {
    return showMenu && items.length > 0 && inputValue.length > 0;
  }, [items, showMenu, inputValue]);

  const isInputExpanded = useMemo(() => {
    return menuFocused || inputValue.length > 0;
  }, [menuFocused, inputValue]);

  const filteredItems = useMemo(() => {
    if (!isFiltering) {
      return items;
    }
    return items.filter((item) => {
      const lowerInputValue = inputValue.toLowerCase().trim();

      return (
        item.label.toLowerCase().includes(lowerInputValue) ||
        item.value.toLowerCase().includes(lowerInputValue)
      );
    });
  }, [items, inputValue, isFiltering]);

  const focusInput = useCallback(() => {
    inputRef.current.focus();
  }, [inputRef]);

  const handleFocusOut = useCallback(() => {
    setShowMenu(false);
    setMenuFocused(false);
  }, []);

  useFocusOut(searchRef, handleFocusOut);

  const handleInputChange = useCallback(
    (item) => {
      setInputValue(item.label);
      onChange(item.value);
    },
    [onChange, setInputValue]
  );

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
    setMenuFocused(false);
  };

  return (
    <SearchContainer
      ref={searchRef}
      className={className}
      {...rest}
      isOpen={isMenuOpen}
      isExpanded={isInputExpanded}
    >
      <InputContainer isOpen={isMenuOpen}>
        <SearchButton
          onClick={() => {
            setMenuFocused(true);
            focusInput();
          }}
          aria-label={`Go to ${ariaLabel}`}
        >
          <SearchIcon />
        </SearchButton>

        <ControlVisibilityContainer isExpanded={isInputExpanded}>
          <label aria-label={ariaLabel} htmlFor={inputId} />
          <StyledInput
            isExpanded={isInputExpanded}
            ref={inputRef}
            autoComplete="off"
            type="text"
            id={inputId}
            name={inputId}
            disabled={disabled}
            value={inputValue}
            onFocus={() => setShowMenu(true)}
            onChange={({ target }) => {
              handleInputChange({ label: target.value, value: target.value });
            }}
            placeholder={placeholder}
          />
          {inputValue.length > 0 && !isMenuOpen && (
            <ClearInputButton
              data-testid="clear-search"
              onClick={handleInputClear}
              aria-label={__('Clear Input', 'web-stories')}
            >
              <CloseIcon />
            </ClearInputButton>
          )}
        </ControlVisibilityContainer>
      </InputContainer>

      {isMenuOpen && (
        <TypeaheadOptions
          isOpen={isMenuOpen}
          items={filteredItems}
          maxItemsVisible={maxItemsVisible}
          onSelect={filteredItems && handleMenuItemSelect}
        />
      )}
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
