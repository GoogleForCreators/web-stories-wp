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
import { useCallback, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { THEME_CONSTANTS } from '../../theme';
import { Menu, MENU_OPTIONS } from '../menu';
import { Popup, PLACEMENT } from '../popup';
import { DropDownContainer, Hint } from './components';
import {
  DEFAULT_POPUP_FILL_WIDTH,
  DEFAULT_PLACEHOLDER,
  DEFAULT_ARIA_CLEAR_LABEL,
  DEFAULT_ARIA_INPUT_LABEL,
} from './constants';
import TypeaheadInput from './input';
import useTypeahead from './useTypeahead';

/**
 *
 * @param {Object} props All props.
 * @param {string} props.ariaInputLabel Aria label passed to input to label for SR users since this component has no visible label.
 * @param {string} props.ariaClearLabel Aria label passed to clear button for SR users.
 * @param {boolean} props.disabled If true, menu will not be openable
 * @param {string} props.emptyText If the array of options is empty this text will display when menu is expanded.
 * @param {Function} props.handleTypeaheadValueChange specific callback to monitor changes in input value separate from onMenuItemClick.
 * This is to separate the inputValue from the selectedValue should the typeahead demand selection from a list as opposed to be freeform.
 * @param {boolean} props.hasError If true, input and hint (if present) will show error styles.
 * @param {string} props.hint Hint text to display below input (optional). If not present, no hint text will display.
 * @param {boolean} props.isFlexibleValue If true, input values will be treated the same as options in the menu are when selected. Essentially, letting the input value be a valid value not just a guide to narrow down menu options.
 * If isFlexibleValue is true, clearing the input will also clear the selectedValue.
 * @param {boolean} props.isKeepMenuOpenOnSelection If true, when a new selection is made the internal functionality to close the menu will not fire, by default is false.
 * @param {boolean} props.isRTL If true, arrow left will trigger down, arrow right will trigger up.
 * @param {Object} props.menuStylesOverride should be formatted as a css template literal with styled components. Gives access to completely overriding menu styles (container div > ul > li).
 * @param {Function} props.onMenuItemClick Triggered when a user clicks or presses 'Enter' on an option, or isFlexibleValue and 'Enter' is pressed on input.
 * @param {Array} props.options All options, should contain either 1) objects with a label, value, anything else you need can be added and accessed through renderItem or 2) Objects containing a label and options, where options is structured as first option with array of objects containing at least value and label - this will create a nested list.
 * @param {string} props.placeholder Placeholder text to display in input if no value is present.
 * @param {string} props.placement placement passed to popover for where menu should expand, defaults to "bottom_end".
 * @param {number} props.popupFillWidth Allows for an override of how much of popup width to take up for dropDown.
 * @param {number} props.popupZIndex Allows for an override of the default popup z index (2).
 * @param {Function} props.renderItem If present when menu is open, will override the base list items rendered for each option, the entire item and whether it is selected will be returned and allow you to style list items internal to a list item without affecting dropdown functionality.
 * @param {string} props.selectedValue The selected value, should correspond to a value in the options array of objects.
 *
 */

export const Typeahead = ({
  ariaInputLabel = DEFAULT_ARIA_INPUT_LABEL,
  ariaClearLabel = DEFAULT_ARIA_CLEAR_LABEL,
  disabled,
  handleTypeaheadValueChange,
  hasError,
  hint,
  isFlexibleValue,
  isKeepMenuOpenOnSelection,
  onMenuItemClick,
  options = [],
  placeholder = DEFAULT_PLACEHOLDER,
  placement = PLACEMENT.BOTTOM,
  popupFillWidth = DEFAULT_POPUP_FILL_WIDTH,
  popupZIndex,
  selectedValue = '',
  ...rest
}) => {
  const listId = useMemo(() => `list-${uuidv4()}`, []);
  const inputId = useMemo(() => `select-button-${uuidv4()}`, []);
  const clearId = useMemo(() => `clear-button-${uuidv4()}`, []);

  const inputRef = useRef();
  const menuRef = useRef();

  const {
    activeOption,
    inputValue,
    isMenuFocused,
    isOpen,
    normalizedOptions,
  } = useTypeahead({
    isFlexibleValue,
    options,
    selectedValue,
    handleTypeaheadValueChange,
  });

  /**
   * Callbacks that begin typeahead interaction
   * handleInputFocus: When input is given focus, set menu to isOpen and reset isMenuFocused to false.
   * handleInputClick: When input is clicked, toggle menu.
   * */
  const handleInputFocus = useCallback(() => {
    isOpen.set(true);
    isMenuFocused.set(false);
  }, [isOpen, isMenuFocused]);

  const handleInputClick = useCallback(
    (event) => {
      event.preventDefault();
      isOpen.set((prevIsOpen) => !prevIsOpen);
    },
    [isOpen]
  );

  /**
   * Callbacks passed to menu
   * handleDismissMenu: when menu is focused out (if isFlexibleValue is false (default), set input back to selectedValue.)
   * handleMenuClick: When item menu is chosen by either cursor or keyboard.
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

      if (!isFlexibleValue && activeOption?.label) {
        inputValue.set(activeOption.label);
      }

      isOpen.set(false);
      isMenuFocused.set(false);

      // move focus to next element if available.
      inputRef.current?.offsetParent?.nextSibling?.focus();
    },
    [activeOption, clearId, inputValue, isFlexibleValue, isOpen, isMenuFocused]
  );

  const handleMenuItemClick = useCallback(
    (event, menuItem) => {
      onMenuItemClick?.(event, menuItem);
      if (!isKeepMenuOpenOnSelection) {
        handleDismissMenu();
      }
    },
    [handleDismissMenu, isKeepMenuOpenOnSelection, onMenuItemClick]
  );

  const handleReturnToInput = useCallback(() => inputRef?.current?.focus(), []);

  /**
   * Callbacks passed to input
   * handleInputChange: When input changes by user.
   * handleClearInputValue: When clear button is triggered.
   * - Will only clear the input value by default.
   * - If isFlexibleValue and onMenuItemClick are present will also trigger onMenuItemClick with an empty string to clear out selected value (presumably - since this is controlled by parent).
   * handleTabClearButton: When keyboard user goes from input to clear button.
   * - Since technically we've already focused out of the input where the menu wants to close, if tab is used on clear button, dismiss menu but don't focus back to input.
   */
  const handleInputChange = useCallback(
    ({ target }) => {
      inputValue.set(target.value);

      if (target.value.length > 0 && !isOpen.value) {
        isOpen.set(!isOpen.value);
      }
    },
    [inputValue, isOpen]
  );

  const handleClearInputValue = useCallback(() => {
    inputValue.set('');
    if (isFlexibleValue) {
      onMenuItemClick?.(null, '');
    }
    handleReturnToInput();
  }, [handleReturnToInput, inputValue, isFlexibleValue, onMenuItemClick]);

  const handleTabClearButton = useCallback(() => {
    isOpen.set(false);
    isMenuFocused.set(false);

    if (!isFlexibleValue && activeOption?.label) {
      inputValue.set(activeOption.label);
    }
  }, [isOpen, isMenuFocused, inputValue, isFlexibleValue, activeOption]);

  const focusSentToList = useCallback(() => isMenuFocused.set(true), [
    isMenuFocused,
  ]);

  const setInputValueToActiveOption = useCallback(
    () => activeOption?.label && inputValue.set(activeOption.label),
    [activeOption, inputValue]
  );

  /**
   * handleInputKeyPress
   * Watch keyDown of input for keys that change interaction
   * ESC: Close menu
   * - Also reset input value to active option if isFlexibleValue is false on escape.
   * TAB:
   * - Close menu on tab if inputValue length is 0
   * - And reset input value to active option if not isFlexibleValue
   * ARROW DOWN: Send focus to menu list
   * ENTER: Trigger menuItemClick if isFlexibleValue is true
   */
  const handleInputKeyPress = useCallback(
    (event) => {
      const { key } = event;
      if (key === 'Escape') {
        isOpen.set(false);
        if (!isFlexibleValue) {
          setInputValueToActiveOption();
        }
      } else if (key === 'Tab') {
        // if inputValue exists then there is a clear button
        if (inputValue.value.length === 0) {
          isOpen.set(false);
          isMenuFocused.set(false);
          if (!isFlexibleValue) {
            setInputValueToActiveOption();
          }
        }
      } else if (key === 'ArrowDown') {
        focusSentToList();
      } else if (key === 'Enter' && isFlexibleValue) {
        handleMenuItemClick(event, inputValue.value);
      }
    },
    [
      isFlexibleValue,
      isOpen,
      setInputValueToActiveOption,
      inputValue.value,
      isMenuFocused,
      focusSentToList,
      handleMenuItemClick,
    ]
  );

  return (
    <DropDownContainer>
      <TypeaheadInput
        // Passed through to input
        aria-label={ariaInputLabel}
        hasError={hasError}
        id={inputId}
        onChange={handleInputChange}
        onClick={handleInputClick}
        onFocus={handleInputFocus}
        onKeyDown={handleInputKeyPress}
        placeholder={placeholder}
        // Used within TypeaheadInput
        ariaClearLabel={ariaClearLabel}
        clearId={clearId}
        disabled={disabled}
        handleClearInputValue={handleClearInputValue}
        handleTabClearButton={handleTabClearButton}
        inputValue={inputValue?.value}
        isFlexibleValue={isFlexibleValue}
        isOpen={isOpen.value}
        listId={listId}
        ref={inputRef}
        {...rest}
      />

      {!disabled && (
        <Popup
          anchor={inputRef}
          isOpen={isOpen.value}
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
            ref={menuRef}
            {...rest}
          />
        </Popup>
      )}
      {hint && (
        <Hint
          hasError={hasError}
          size={THEME_CONSTANTS.TYPOGRAPHY.TEXT_SIZES.SMALL}
        >
          {hint}
        </Hint>
      )}
    </DropDownContainer>
  );
};

Typeahead.propTypes = {
  ariaInputLabel: PropTypes.string,
  ariaClearLabel: PropTypes.string,
  disabled: PropTypes.bool,
  emptyText: PropTypes.string,
  handleTypeaheadValueChange: PropTypes.func,
  hasError: PropTypes.bool,
  hint: PropTypes.string,
  isFlexibleValue: PropTypes.bool,
  isKeepMenuOpenOnSelection: PropTypes.bool,
  isRTL: PropTypes.bool,
  menuStylesOverride: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onMenuItemClick: PropTypes.func,
  options: MENU_OPTIONS,
  placeholder: PropTypes.string,
  placement: PropTypes.oneOf(Object.values(PLACEMENT)),
  popupFillWidth: PropTypes.number,
  popupZIndex: PropTypes.number,
  renderItem: PropTypes.object,
  selectedValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
  ]),
};
