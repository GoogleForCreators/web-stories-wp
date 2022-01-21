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
import { useCallback, useMemo, forwardRef } from '@googleforcreators/react';
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

const SearchInput = (
  {
    ariaClearLabel,
    clearId,
    disabled,
    handleClearInput = () => {},
    handleTabClear,
    inputValue,
    isOpen,
    listId,
    className = '',
    ...rest
  },
  ref
) => {
  // Avoid conditional rendering in this input because rerendering will remove the focus styling

  const activeInput = useMemo(
    () => inputValue.length > 0 && isOpen,
    [isOpen, inputValue]
  );
  const alignInputCenter = useMemo(
    () => inputValue.length === 0 && !isOpen,
    [isOpen, inputValue]
  );

  const onClearButtonKeyDown = useCallback(
    ({ key }) => {
      if (key === 'Tab') {
        handleTabClear?.();
      }
    },
    [handleTabClear]
  );

  return (
    <InputContainer className={className}>
      <Input
        aria-disabled={disabled}
        autocomplete="off"
        disabled={disabled}
        ref={ref}
        type="search"
        value={inputValue}
        {...(listId && {
          role: 'combobox',
          ['aria-expanded']: isOpen,
          ['aria-controls']: listId,
          ['aria-owns']: listId,
          ['aria-autocomplete']: 'list',
        })}
        {...rest}
      />
      <SearchDecoration
        activeSearch={alignInputCenter}
        aria-hidden
        disabled={disabled}
      >
        <SearchIcon id={clearId} />
      </SearchDecoration>

      <ClearButton
        type="button"
        isVisible={activeInput}
        tabIndex={0}
        aria-label={activeInput && ariaClearLabel}
        onClick={handleClearInput}
        onKeyDown={onClearButtonKeyDown}
      >
        <ClearIcon id={clearId} data-testid="clear-search-icon" />
      </ClearButton>

      <ChevronDecoration
        disabled={disabled}
        aria-hidden={activeInput}
        isVisible={!activeInput && inputValue.length > 0}
      >
        <ChevronIcon $isMenuOpen={isOpen} data-testid="chevron-search-icon" />
      </ChevronDecoration>
    </InputContainer>
  );
};

export default forwardRef(SearchInput);

SearchInput.propTypes = {
  ariaClearLabel: PropTypes.string.isRequired,
  clearId: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  listId: PropTypes.string.isRequired,
  handleClearInput: PropTypes.func.isRequired,
  handleTabClear: PropTypes.func.isRequired,
  inputValue: PropTypes.string,
  isOpen: PropTypes.bool,
  className: PropTypes.string,
};
