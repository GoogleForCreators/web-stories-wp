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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Internal dependencies
 */
import { KEYS } from '../../constants';
import { Close as CloseIcon, Search as SearchIcon } from '../../icons';
import useFocusOut from '../../utils/useFocusOut';
import TypeaheadOptions from '../typeaheadOptions';
import { TypographyPresets } from '../typography';

const SearchContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  border-radius: ${({ theme }) => `${theme.expandedTypeahead.borderRadius}px`};
  border: none;
  background: none;

  @media ${({ theme }) => theme.breakpoint.largeDisplayPhone} {
    flex: ${({ isExpanded }) => (isExpanded ? '1 0 100%' : '0 1 40px')};
    transition: flex 0.2s cubic-bezier(0.39, 0.575, 0.565, 1);
  }
`;
SearchContainer.propTypes = {
  isExpanded: PropTypes.bool,
  isOpen: PropTypes.bool,
};

const InputContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  padding: 5px 8px;
  border-radius: ${({ theme }) => `${theme.typeahead.borderRadius}px`};
  border: 1px solid ${({ theme }) => theme.colors.gray50};
  color: ${({ theme }) => theme.colors.gray500};
  background-color: ${({ theme }) => theme.colors.gray25};
`;

const ControlVisibilityContainer = styled.div`
  position: relative;
  display: flex;
  flex-grow: 1;

  @media ${({ theme }) => theme.breakpoint.largeDisplayPhone} {
    opacity: ${({ isExpanded }) => (isExpanded ? '1' : '0')};
    transition: opacity 0.2s cubic-bezier(0.39, 0.575, 0.565, 1);
  }
`;
ControlVisibilityContainer.propTypes = {
  isExpanded: PropTypes.bool,
};

const StyledInput = styled.input`
  ${TypographyPresets.Small};
  position: relative;
  height: 100%;
  width: 100%;
  padding: 0 0 0 7.5px;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.colors.gray900};
  background-color: transparent;
  border: none;

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
  height: 16px;
  & > svg {
    height: 100%;
  }

  @media ${({ theme }) => theme.breakpoint.largeDisplayPhone} {
    color: ${({ theme }) => theme.colors.gray500};
  }
`;

const ClearInputButton = styled.button`
  border: none;
  background-color: transparent;
  margin: auto 0;
  padding: 0;
  color: ${({ theme }) => theme.colors.gray600};
  cursor: pointer;
  height: 12px;

  & > svg {
    height: 100%;
  }
`;

const TypeaheadInput = ({
  inputId,
  items,
  className,
  disabled,
  onChange,
  placeholder,
  value = '',
  ariaLabel,
  isFiltering,
  ...rest
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [menuFocused, setMenuFocused] = useState(false);

  const [inputValue, setInputValue] = useState(value);

  const [selectedValueIndex, setSelectedValueIndex] = useState(-1);
  const menuOpened = useRef(false);
  const searchRef = useRef();
  const inputRef = useRef();

  const isMenuOpen = useMemo(() => {
    return showMenu && items.length > 0 && inputValue.length > 0;
  }, [items, showMenu, inputValue]);

  const isInputExpanded = useMemo(() => {
    return menuFocused || inputValue.length > 0;
  }, [menuFocused, inputValue]);

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
      if (!showMenu) {
        setShowMenu(true);
      }
      setInputValue(item.label);
      onChange(item.value.trim());
    },
    [onChange, setInputValue, setShowMenu, showMenu]
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

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === KEYS.DOWN) {
        event.preventDefault();
        searchResultsRef.current?.children[
          selectedValueIndex > -1 ? selectedValueIndex : 0
        ].focus();
      }
    },
    [selectedValueIndex]
  );

  useEffect(() => {
    if (!isMenuOpen && menuOpened.current) {
      menuOpened.current = false;
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen && !menuOpened.current) {
      menuOpened.current = true;
      const selectionToCheckFor = value && value.toLowerCase().trim();
      const existingValueOnMenuOpen = selectionToCheckFor
        ? items.findIndex(
            (item) =>
              (item.value &&
                item.value.toLowerCase() === selectionToCheckFor) ||
              item.label.toLowerCase() === selectionToCheckFor
          )
        : -1;
      if (existingValueOnMenuOpen > -1) {
        setSelectedValueIndex(existingValueOnMenuOpen);
      }
    }
  }, [isMenuOpen, items, value]);

  const searchResultsRef = useRef();
  return (
    <SearchContainer
      ref={searchRef}
      className={className}
      {...rest}
      isOpen={isMenuOpen}
      isExpanded={isInputExpanded}
    >
      <InputContainer>
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
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
          />
        </ControlVisibilityContainer>
        {inputValue.length > 0 && (
          <ClearInputButton
            data-testid="clear-search"
            onClick={handleInputClear}
            aria-label={__('Clear Input', 'web-stories')}
          >
            <CloseIcon />
          </ClearInputButton>
        )}
      </InputContainer>

      {isMenuOpen && (
        <TypeaheadOptions
          ref={searchResultsRef}
          handleFocusToInput={focusInput}
          selectedIndex={selectedValueIndex}
          isOpen={isMenuOpen}
          items={items}
          onSelect={items && handleMenuItemSelect}
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
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

export default TypeaheadInput;
