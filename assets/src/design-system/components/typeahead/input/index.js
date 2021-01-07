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
import { useCallback, useMemo, forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import {
  IconContainer,
  Input,
  InputContainer,
  StyledClear,
  StyledChevron,
  StyledSearch,
} from './components';

const TypeaheadInput = (
  {
    ariaClearLabel,
    clearId,
    disabled,
    handleClearInputValue,
    handleTabClearButton,
    inputValue,
    isFlexibleValue,
    isOpen,
    listId,
    ...rest
  },
  ref
) => {
  // show the search icon ahead of the input if input is active or if isFlexibleValue is true and inputValue has a length greater than 0
  const showSearchIcon = useMemo(
    () => isOpen || (isFlexibleValue && inputValue.length > 0),
    [isFlexibleValue, inputValue, isOpen]
  );
  // show clear button when there is text present in input and the menu isn't open or isFlexibleValue is true.
  const showClearButton = useMemo(
    () => inputValue.length > 0 && (isOpen || isFlexibleValue),
    [inputValue, isFlexibleValue, isOpen]
  );

  // show drop down icon when clear button is not present: menu is not open and there is no input if isFlexibleValue,
  // or if not open and showClearButton is false and isMenuFocused is true.
  const showDropDownIcon = useMemo(
    () => (isFlexibleValue ? inputValue.length === 0 : !showClearButton),
    [inputValue.length, isFlexibleValue, showClearButton]
  );

  const onClearButtonKeyDown = useCallback(
    ({ key }) => {
      if (key === 'Tab') {
        handleTabClearButton();
      }
    },
    [handleTabClearButton]
  );

  return (
    <InputContainer disabled={disabled}>
      <Input
        aria-autocomplete="list"
        aria-controls={listId}
        aria-disabled={disabled}
        aria-expanded={isOpen}
        aria-owns={listId}
        autocomplete="off"
        disabled={disabled}
        hasSearchIcon={showSearchIcon}
        isOpen={isOpen}
        ref={ref}
        role="combobox"
        type="search"
        value={inputValue}
        {...rest}
      />
      {showSearchIcon && (
        <IconContainer alignLeft as={'div'} aria-hidden={true}>
          <StyledSearch id={clearId} data-testid={'search-typeahead-icon'} />
        </IconContainer>
      )}
      <IconContainer
        disabled={disabled}
        onClick={handleClearInputValue}
        {...(showClearButton && { onKeyDown: onClearButtonKeyDown })}
        aria-label={showClearButton && ariaClearLabel}
        as={showDropDownIcon ? 'div' : 'button'}
        aria-hidden={showDropDownIcon}
      >
        {showClearButton && (
          <StyledClear
            aria-hidden={true}
            id={clearId}
            data-testid={'clear-typeahead-icon'}
          />
        )}
        {showDropDownIcon && (
          <StyledChevron
            isOpen={isOpen}
            aria-hidden={true}
            data-testid={'chevron-typeahead-icon'}
          />
        )}
      </IconContainer>
    </InputContainer>
  );
};

export default forwardRef(TypeaheadInput);

TypeaheadInput.propTypes = {
  ariaClearLabel: PropTypes.string.isRequired,
  clearId: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  listId: PropTypes.string.isRequired,
  handleClearInputValue: PropTypes.func.isRequired,
  handleTabClearButton: PropTypes.func.isRequired,
  inputValue: PropTypes.string,
  isFlexibleValue: PropTypes.bool,
  isOpen: PropTypes.bool,
};
