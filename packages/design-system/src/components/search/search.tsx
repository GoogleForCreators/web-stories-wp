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
  useRef,
  useFocusOut,
} from '@googleforcreators/react';
import { v4 as uuidv4 } from 'uuid';
import { __, sprintf } from '@googleforcreators/i18n';
import styled from 'styled-components';
import type { ChangeEvent, KeyboardEvent, UIEvent } from 'react';

/**
 * Internal dependencies
 */
import { TextSize } from '../../theme';
import { Menu } from '../menu';
import type { DropdownItem, DropdownValue } from '../menu';
import { Popup, Placement } from '../popup';
import { DropDownContainer, Hint, Label } from './components';
import {
  DEFAULT_POPUP_FILL_WIDTH,
  DEFAULT_PLACEHOLDER,
  DEFAULT_ARIA_CLEAR_LABEL,
  DEFAULT_ARIA_INPUT_LABEL,
} from './constants';
import SearchInput from './input';
import useSearch from './useSearch';
import type { SearchProps } from './types';

const SearchInputWrapper = styled.div``;

function Search({
  ariaInputLabel = DEFAULT_ARIA_INPUT_LABEL,
  ariaClearLabel = DEFAULT_ARIA_CLEAR_LABEL,
  disabled,
  handleSearchValueChange,
  hasError,
  hint,
  label,
  onMenuItemClick,
  onClear,
  options = [],
  placeholder = DEFAULT_PLACEHOLDER,
  placement = Placement.Bottom,
  popupFillWidth = DEFAULT_POPUP_FILL_WIDTH,
  popupZIndex,
  selectedValue,
  searchValue,
  ...rest
}: SearchProps) {
  const listId = useMemo(() => `list-${uuidv4()}`, []);
  const inputId = useMemo(() => `select-button-${uuidv4()}`, []);
  const clearId = useMemo(() => `clear-button-${uuidv4()}`, []);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputWrapperRef = useRef<HTMLDivElement | null>(null);

  const {
    activeOption,
    getActiveOption,
    inputState,
    setInputState,
    isMenuFocused,
    setIsMenuFocused,
    isOpen,
    setIsOpen,
    groups,
  } = useSearch({
    options,
    selectedValue,
    searchValue,
    handleSearchValueChange,
  });

  const isMenuHidden = useMemo(
    () => Boolean(disabled || !inputState?.length),
    [disabled, inputState]
  );

  /**
   * Callbacks that begin search interaction
   */
  const handleInputFocus = useCallback(() => {
    setIsOpen(true);
    setIsMenuFocused(false);
  }, [setIsOpen, setIsMenuFocused]);

  const handleInputClick = useCallback(
    (event: UIEvent) => {
      event.preventDefault();
      setIsOpen(true);
    },
    [setIsOpen]
  );

  /**
   * Callbacks passed to menu
   */

  const handleDismissMenu = useCallback(
    (event?: Event) => {
      // don't dismiss menu if clicking on clear button while menu is open
      if (
        clearId &&
        event?.currentTarget instanceof HTMLElement &&
        event.currentTarget.id === clearId
      ) {
        return;
      }
      setIsOpen(false);
    },
    [clearId, setIsOpen]
  );

  const handleMenuItemClick = useCallback(
    (event: Event, menuItem: DropdownValue) => {
      setIsOpen(false);
      const newOption: DropdownItem = getActiveOption(menuItem) || {
        label: String(menuItem),
        value: menuItem,
      };
      setInputState(String(newOption.label));
      onMenuItemClick?.(event, newOption);
    },
    [getActiveOption, setInputState, setIsOpen, onMenuItemClick]
  );

  const handleReturnToInput = useCallback(() => inputRef?.current?.focus(), []);

  /**
   * Callbacks passed to input
   */
  const handleInputChange = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      setInputState(target.value);
      setIsOpen(target.value.length > 0);
    },
    [setInputState, setIsOpen]
  );

  const handleClearInput = useCallback(() => {
    setInputState(undefined);
    onClear?.();
    handleReturnToInput?.();
  }, [handleReturnToInput, setInputState, onClear]);

  const handleTabClear = useCallback(() => {
    setIsOpen(false);
    setIsMenuFocused(false);
  }, [setIsOpen, setIsMenuFocused]);

  const focusSentToList = useCallback(
    () => setIsMenuFocused(true),
    [setIsMenuFocused]
  );

  const handleEndSearch = useCallback(() => {
    if (isMenuHidden || inputState?.trim().length === 0) {
      setIsMenuFocused(false);
      setIsOpen(false);
    }
  }, [inputState, setIsMenuFocused, isMenuHidden, setIsOpen]);

  const handleInputKeyPress = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      const { key } = event;
      if (key === 'Escape') {
        if (!isMenuHidden) {
          setIsMenuFocused(false);
        }
      } else if (key === 'Tab') {
        handleEndSearch();
      } else if (key === 'ArrowDown') {
        focusSentToList();
      } else if (key === 'Enter') {
        if (inputState && inputState.trim().length > 0) {
          handleMenuItemClick(event.nativeEvent, String(inputState));
        }
      }
    },
    [
      isMenuHidden,
      setIsMenuFocused,
      handleEndSearch,
      focusSentToList,
      inputState,
      handleMenuItemClick,
    ]
  );

  // By using inputWrapperRef instead of inputRef we ensure that this isn't triggered
  // when clicking on the search input's "Clear" button.
  // It will still trigger when actually clicking on an option within the Popup.
  useFocusOut(inputWrapperRef, handleEndSearch, [handleEndSearch]);

  return (
    <DropDownContainer>
      {label && (
        <Label size={TextSize.Small} disabled={disabled} isBold>
          {label}
        </Label>
      )}
      <SearchInputWrapper ref={inputWrapperRef}>
        <SearchInput
          // Passed through to input
          aria-label={ariaInputLabel}
          hasError={hasError}
          id={inputId}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onFocus={handleInputFocus}
          onKeyDown={handleInputKeyPress}
          placeholder={placeholder}
          // Used within SearchInput
          ariaClearLabel={ariaClearLabel}
          clearId={clearId}
          disabled={disabled}
          handleClearInput={handleClearInput}
          handleTabClear={handleTabClear}
          inputValue={inputState || ''}
          isOpen={isOpen}
          listId={listId}
          ref={inputRef}
          {...rest}
        />
      </SearchInputWrapper>

      {!isMenuHidden && (
        <Popup
          anchor={inputRef}
          isOpen={isOpen}
          placement={placement}
          fillWidth={popupFillWidth}
          zIndex={popupZIndex}
          ignoreMaxOffsetY
        >
          <Menu
            activeValue={activeOption?.value}
            handleReturnToParent={handleReturnToInput}
            isMenuFocused={isMenuFocused}
            listId={listId}
            menuAriaLabel={sprintf(
              /* translators: %s: dropdown aria label or general dropdown label if there is no specific aria label. */
              __('%s Option List Selector', 'web-stories'),
              ariaInputLabel
            )}
            onDismissMenu={handleDismissMenu}
            handleMenuItemSelect={handleMenuItemClick}
            groups={groups}
            parentId={inputId}
            {...rest}
          />
        </Popup>
      )}

      {hint && (
        <Hint hasError={hasError} size={TextSize.Small}>
          {hint}
        </Hint>
      )}
    </DropDownContainer>
  );
}

export default Search;
