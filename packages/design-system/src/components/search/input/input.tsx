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
import {
  useCallback,
  useMemo,
  useState,
  forwardRef,
} from '@googleforcreators/react';
import type { ForwardedRef, ComponentPropsWithoutRef } from 'react';

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

interface SearchInputProps extends ComponentPropsWithoutRef<typeof Input> {
  ariaClearLabel?: string;
  clearId?: string;
  handleClearInput?: () => void;
  handleTabClear?: () => void;
  inputValue: string;
  isOpen: boolean;
  listId?: string;
  className?: string;
  disabled?: boolean;
}

const SearchInput = forwardRef(
  (
    {
      ariaClearLabel,
      clearId,
      disabled,
      handleClearInput = () => undefined,
      handleTabClear,
      inputValue,
      isOpen,
      listId,
      className = '',
      ...rest
    }: SearchInputProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const [inputChanged, setInputChanged] = useState(false);
    const [isEmptyValue, setIsEmptyValue] = useState(false);
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

    const handleOnInput = useCallback(
      (value: string) => {
        if (value === '') {
          setIsEmptyValue(true);
        } else {
          setIsEmptyValue(false);
        }
        if (isOpen) {
          setInputChanged(true);
        } else {
          setInputChanged(false);
        }
      },
      [isOpen]
    );

    return (
      <InputContainer className={className}>
        <Input
          aria-disabled={disabled}
          autoComplete="off"
          disabled={disabled}
          onInput={(event) => handleOnInput(event.currentTarget.value)}
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
          isVisible={activeInput && inputChanged}
          tabIndex={0}
          aria-label={activeInput && inputChanged ? ariaClearLabel : ''}
          onClick={handleClearInput}
          onKeyDown={onClearButtonKeyDown}
        >
          <ClearIcon id={clearId} data-testid="clear-search-icon" />
        </ClearButton>

        <ChevronDecoration
          disabled={disabled}
          aria-hidden={(activeInput && inputChanged) || isEmptyValue}
          isVisible={
            (!activeInput || !inputChanged) &&
            !isEmptyValue &&
            inputValue.length > 0
          }
        >
          <ChevronIcon $isMenuOpen={isOpen} data-testid="chevron-search-icon" />
        </ChevronDecoration>
      </InputContainer>
    );
  }
);

export default SearchInput;
