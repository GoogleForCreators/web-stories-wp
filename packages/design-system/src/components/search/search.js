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
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { __, sprintf } from '@googleforcreators/i18n';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { THEME_CONSTANTS } from '../../theme';
import { Menu, MENU_OPTIONS } from '../menu';
import { Popup, PLACEMENT } from '../popup';
import { DropDownContainer, Hint, Label } from './components';
import {
  DEFAULT_POPUP_FILL_WIDTH,
  DEFAULT_PLACEHOLDER,
  DEFAULT_ARIA_CLEAR_LABEL,
  DEFAULT_ARIA_INPUT_LABEL,
} from './constants';
import SearchInput from './input';
import useSearch from './useSearch';

const SearchInputWrapper = styled.div``;

/**
 *
 * @param {Object} props All props.
 * @param {string} props.ariaInputLabel Aria label passed to input to label for SR users since this component has no visible label.
 * @param {string} props.ariaClearLabel Aria label passed to clear button for SR users.
 * @param {boolean} props.disabled If true, menu will not be openable
 * @param {string} props.emptyText If the array of options is empty this text will display when menu is expanded.
 * @param {Function} props.handleSearchValueChange specific callback to monitor changes in input value separate from onMenuItemClick.
 * This is to separate the inputState from the selectedValue should the search demand selection from a list as opposed to be freeform.
 * @param {boolean} props.hasError If true, input and hint (if present) will show error styles.
 * @param {string} props.hint Hint text to display below input (optional). If not present, no hint text will display.
 * @param {boolean} props.isRTL If true, arrow left will trigger down, arrow right will trigger up.
 * @param {string} props.label If present, will display a text label above input. ariaLabel controls accessibility label of input since there are times search components are present without label text visible.
 * @param {Object} props.menuStylesOverride should be formatted as a css template literal with styled components. Gives access to completely overriding menu styles (container div > ul > li).
 * @param {Function} props.onMenuItemClick Triggered when a user clicks or presses 'Enter' on an option, or 'Enter' is pressed on input. Returns an object containing label and value keys.
 * @param {Function} props.onClear Triggered when a user clicks clear 'x' button on the search input.
 * @param {Array} props.options All options, should contain either 1) objects with a label, value, anything else you need can be added and accessed through renderItem or 2) Objects containing a label and options, where options is structured as first option with array of objects containing at least value and label - this will create a nested list.
 * @param {string} props.placeholder Placeholder text to display in input if no value is present.
 * @param {string} props.placement placement passed to popover for where menu should expand, defaults to "bottom_end".
 * @param {number} props.popupFillWidth Allows for an override of how much of popup width to take up for dropDown.
 * @param {number} props.popupZIndex Allows for an override of the default popup z index (2).
 * @param {Function} props.renderItem If present when menu is open, will override the base list items rendered for each option, the entire item and whether it is selected will be returned and allow you to style list items internal to a list item without affecting dropdown functionality.
 * @param {string} props.selectedValue The selected value, should correspond to an object in the options array of objects.
 * @param {string} props.searchValue The search value
 */

export const Search = ({
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
  placement = PLACEMENT.BOTTOM,
  popupFillWidth = DEFAULT_POPUP_FILL_WIDTH,
  popupZIndex,
  selectedValue = {},
  searchValue,
  ...rest
}) => {
  const listId = useMemo(() => `list-${uuidv4()}`, []);
  const inputId = useMemo(() => `select-button-${uuidv4()}`, []);
  const clearId = useMemo(() => `clear-button-${uuidv4()}`, []);

  const inputRef = useRef();
  const inputWrapperRef = useRef();

  const {
    activeOption,
    getActiveOption,
    inputState,
    isMenuFocused,
    isOpen,
    normalizedOptions,
  } = useSearch({
    options,
    selectedValue,
    searchValue,
    handleSearchValueChange,
  });

  const isMenuHidden = useMemo(
    () =>
      Boolean(disabled || !inputState?.value || inputState.value?.length === 0),
    [disabled, inputState]
  );

  /**
   * Callbacks that begin search interaction
   */
  const handleInputFocus = useCallback(() => {
    isOpen.set(true);
    isMenuFocused.set(false);
  }, [isOpen, isMenuFocused]);

  const handleInputClick = useCallback(
    (event) => {
      event.preventDefault();
      isOpen.set(true);
    },
    [isOpen]
  );

  /**
   * Callbacks passed to menu
   */

  const handleDismissMenu = useCallback(
    (event) => {
      // don't dismiss menu if clicking on clear button while menu is open
      if (
        clearId &&
        (event?.srcElement?.id === clearId ||
          event?.srcElement?.nearestViewportElement?.id === clearId)
      ) {
        return;
      }
      isOpen.set(false);
    },
    [clearId, isOpen]
  );

  const handleMenuItemClick = useCallback(
    (event, menuItem) => {
      isOpen.set(false);
      const newOption = getActiveOption(menuItem) || {
        label: menuItem,
        value: menuItem,
      };
      inputState.set(newOption.label);
      onMenuItemClick?.(event, newOption);
    },
    [getActiveOption, inputState, isOpen, onMenuItemClick]
  );

  const handleReturnToInput = useCallback(() => inputRef?.current?.focus(), []);

  /**
   * Callbacks passed to input
   */
  const handleInputChange = useCallback(
    ({ target }) => {
      inputState.set(target.value);

      if (target.value.length > 0 && !isOpen.value) {
        isOpen.set(!isOpen.value);
      }
    },
    [inputState, isOpen]
  );

  const handleClearInput = useCallback(() => {
    inputState.set(undefined);
    onClear();
    handleReturnToInput();
  }, [handleReturnToInput, inputState, onClear]);

  const handleTabClear = useCallback(() => {
    isOpen.set(false);
    isMenuFocused.set(false);
  }, [isOpen, isMenuFocused]);

  const focusSentToList = useCallback(
    () => isMenuFocused.set(true),
    [isMenuFocused]
  );

  const handleEndSearch = useCallback(() => {
    if (isMenuHidden || inputState.value?.trim().length === 0) {
      isMenuFocused.set(false);
      isOpen.set(false);
    }
  }, [inputState, isMenuFocused, isMenuHidden, isOpen]);

  const handleInputKeyPress = useCallback(
    (event) => {
      const { key } = event;
      if (key === 'Escape') {
        if (!isMenuHidden) {
          isMenuFocused.set(false);
        }
      } else if (key === 'Tab') {
        handleEndSearch(event);
      } else if (key === 'ArrowDown') {
        focusSentToList();
      } else if (key === 'Enter') {
        if (inputState.value.trim().length > 0) {
          handleMenuItemClick(event, inputState.value);
        }
      }
    },
    [
      isMenuHidden,
      isMenuFocused,
      handleEndSearch,
      focusSentToList,
      handleMenuItemClick,
      inputState.value,
    ]
  );

  // By using inputWrapperRef instead of inputRef we ensure that this isn't triggered
  // when clicking on the search input's "Clear" button.
  // It will still trigger when actually clicking on an option within the Popup.
  useFocusOut(inputWrapperRef, handleEndSearch, [handleEndSearch]);

  return (
    <DropDownContainer>
      {label && (
        <Label
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
          disabled={disabled}
          forwardedAs="span"
          isBold
        >
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
          inputValue={inputState?.value || ''}
          isOpen={isOpen?.value}
          listId={listId}
          ref={inputRef}
          {...rest}
        />
      </SearchInputWrapper>

      {!isMenuHidden && (
        <Popup
          anchor={inputRef}
          isOpen={isOpen?.value}
          placement={placement}
          fillWidth={popupFillWidth}
          zIndex={popupZIndex}
        >
          <Menu
            activeValue={activeOption?.value}
            handleReturnToParent={handleReturnToInput}
            isMenuFocused={isMenuFocused.value}
            listId={listId}
            menuAriaLabel={sprintf(
              /* translators: %s: dropdown aria label or general dropdown label if there is no specific aria label. */
              __('%s Option List Selector', 'web-stories'),
              ariaInputLabel
            )}
            onDismissMenu={handleDismissMenu}
            onMenuItemClick={handleMenuItemClick}
            options={normalizedOptions}
            parentId={inputId}
            {...rest}
          />
        </Popup>
      )}

      {hint && (
        <Hint
          hasError={hasError}
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
        >
          {hint}
        </Hint>
      )}
    </DropDownContainer>
  );
};

Search.propTypes = {
  ariaInputLabel: PropTypes.string,
  ariaClearLabel: PropTypes.string,
  disabled: PropTypes.bool,
  emptyText: PropTypes.string,
  handleSearchValueChange: PropTypes.func,
  hasError: PropTypes.bool,
  hint: PropTypes.string,
  label: PropTypes.string,
  menuStylesOverride: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onMenuItemClick: PropTypes.func,
  onClear: PropTypes.func,
  options: MENU_OPTIONS,
  placeholder: PropTypes.string,
  placement: PropTypes.oneOf(Object.values(PLACEMENT)),
  popupFillWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  popupZIndex: PropTypes.number,
  renderItem: PropTypes.object,
  selectedValue: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
      PropTypes.number,
    ]),
  }),
  searchValue: PropTypes.string,
};
