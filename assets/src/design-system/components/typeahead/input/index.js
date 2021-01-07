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
import { useMemo, forwardRef } from 'react';
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
    ariaInputLabel,
    ariaClearLabel,
    clearId,
    disabled,
    id,
    listId,
    handleClearInputValue,
    inputValue,
    isOpen,
    isFlexibleValue,
    ...rest
  },
  ref
) => {
  // show the search icon ahead of the input if input is active or if isFlexibleValue is true and inputValue has a length greater than 0
  const showSearchIcon = useMemo(
    () => (isFlexibleValue ? inputValue.length > 0 || isOpen : isOpen),
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

  return (
    <InputContainer disabled={disabled}>
      <Input
        aria-label={ariaInputLabel}
        aria-autocomplete="list"
        aria-controls={listId}
        aria-disabled={disabled}
        aria-expanded={isOpen}
        aria-owns={listId}
        autocomplete="off"
        disabled={disabled}
        hasSearchIcon={showSearchIcon}
        isOpen={isOpen}
        name={id}
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
        label={showClearButton && ariaClearLabel}
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
  ariaInputLabel: PropTypes.string.isRequired,
  ariaClearLabel: PropTypes.string.isRequired,
  clearId: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  listId: PropTypes.string.isRequired,
  handleClearInputValue: PropTypes.func.isRequired,
  inputValue: PropTypes.string,
  isFlexibleValue: PropTypes.bool,
  isOpen: PropTypes.bool,
};
