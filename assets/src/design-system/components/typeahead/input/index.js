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
import { useCallback, forwardRef } from 'react';
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
  /**
   * show the search icon ahead of the input:
   * 1) if input is active
   * 2) if isFlexibleValue is true and inputValue has a length greater than 0
   */
  const showSearchIcon = isOpen || (isFlexibleValue && inputValue.length > 0);

  /**
   * show clear button:
   * 1) when there is text present in input and the menu isn't open or isFlexibleValue is true.
   */
  const showClearButton = inputValue.length > 0 && (isOpen || isFlexibleValue);

  /**
   * show drop down icon when:
   * 1) input has no value
   * 2) when clear button is not present
   */
  const showDropDownIcon = isFlexibleValue
    ? inputValue.length === 0
    : !showClearButton;

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
          <StyledClear id={clearId} data-testid={'clear-typeahead-icon'} />
        )}
        {showDropDownIcon && (
          <StyledChevron
            isOpen={isOpen}
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
