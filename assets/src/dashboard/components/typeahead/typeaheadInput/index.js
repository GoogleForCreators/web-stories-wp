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
import { useCallback, useRef } from 'react';

/**
 * Internal dependencies
 */
import { KEYS } from '../../../constants';
import { Close as CloseIcon, Search as SearchIcon } from '../../../icons';
import useFocusOut from '../../../utils/useFocusOut';
import TypeaheadOptions from '../typeaheadOptions';
import useTypeahead from '../useTypeahead';
import {
  SearchContainer,
  InputContainer,
  ControlVisibilityContainer,
  StyledInput,
  SearchButton,
  ClearInputButton,
} from './components';

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
  const {
    isMenuOpen,
    isInputExpanded,
    showMenu,
    menuFocused,
    inputValue,
    selectedValueIndex,
  } = useTypeahead({ items, value });

  const searchRef = useRef();
  const inputRef = useRef();
  const searchResultsRef = useRef();

  const focusInput = useCallback(() => {
    inputRef.current.focus();
  }, [inputRef]);

  const handleFocusOut = useCallback(() => {
    showMenu.set(false);
    menuFocused.set(false);
  }, [showMenu, menuFocused]);

  useFocusOut(searchRef, handleFocusOut);

  const handleInputChange = useCallback(
    (item) => {
      if (!showMenu.value) {
        showMenu.set(true);
      }
      inputValue.set(item.label);
      onChange(item.value.trim());
    },
    [onChange, inputValue, showMenu]
  );

  const handleMenuItemSelect = (item) => {
    if (!item.value) {
      return;
    }
    handleInputChange(item);
    showMenu.set(false);
  };

  const handleInputClear = () => {
    handleInputChange({ label: '', value: '' });
    showMenu.set(false);
    menuFocused.set(false);
  };

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === KEYS.DOWN) {
        event.preventDefault();
        searchResultsRef.current?.children[
          selectedValueIndex.value > -1 ? selectedValueIndex.value : 0
        ].focus();
      }
    },
    [selectedValueIndex]
  );

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
            menuFocused.set(true);
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
            value={inputValue.value}
            onFocus={() => showMenu.set(true)}
            onChange={({ target }) => {
              handleInputChange({ label: target.value, value: target.value });
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
          />
        </ControlVisibilityContainer>
        {inputValue.value.length > 0 && (
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
          selectedIndex={selectedValueIndex.value}
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
