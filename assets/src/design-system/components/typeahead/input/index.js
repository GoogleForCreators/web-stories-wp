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
  Input,
  InputContainer,
  ClearIcon,
  ChevronIcon,
  ChevronDecoration,
  SearchDecoration,
  SearchIcon,
  ClearButton,
} from './components';

const TypeaheadInput = (
  {
    ariaClearLabel,
    clearId,
    disabled,
    handleClearInputValue,
    handleTabClearButton,
    inputValue,
    isOpen,
    listId,
    ...rest
  },
  ref
) => {
  const activeInput = inputValue.length > 0 && isOpen;
  const alignInputCenter = inputValue.length === 0 && !isOpen;

  const onClearButtonKeyDown = useCallback(
    ({ key }) => {
      if (key === 'Tab') {
        handleTabClearButton?.();
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
        isOpen={isOpen}
        ref={ref}
        role="combobox"
        type="search"
        value={inputValue}
        alignCenter={alignInputCenter}
        {...rest}
      />
      <SearchDecoration
        alignCenter={alignInputCenter}
        aria-hidden={true}
        disabled={disabled}
      >
        <SearchIcon id={clearId} data-testid={'search-typeahead-icon'} />
      </SearchDecoration>
      {activeInput && (
        <ClearButton
          tabIndex={0}
          aria-label={activeInput && ariaClearLabel}
          onClick={handleClearInputValue}
          onKeyDown={onClearButtonKeyDown}
        >
          <ClearIcon id={clearId} data-testid={'clear-typeahead-icon'} />
        </ClearButton>
      )}
      {!activeInput && inputValue.length > 0 && (
        <ChevronDecoration disabled={disabled} aria-hidden={!activeInput}>
          <ChevronIcon isOpen={isOpen} data-testid={'chevron-typeahead-icon'} />
        </ChevronDecoration>
      )}
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
  isOpen: PropTypes.bool,
};
