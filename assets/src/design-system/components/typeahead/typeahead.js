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
 * @param {boolean} props.isRTL If true, arrow left will trigger down, arrow right will trigger up.
 * @param {Object} props.menuStylesOverride should be formatted as a css template literal with styled components. Gives access to completely overriding menu styles (container div > ul > li).
 * @param {Function} props.onMenuItemClick Triggered when a user clicks or presses 'Enter' on an option, or 'Enter' is pressed on input.
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
    options,
    selectedValue,
    handleTypeaheadValueChange,
  });

  const isMenuHidden = useMemo(() => disabled || !inputValue?.value, [
    disabled,
    inputValue,
  ]);

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
   * handleDismissMenu: Focus out menu, set isOpen to false.
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

      isOpen.set(false);
      isMenuFocused.set(false);

      // move focus to next element if available.
      inputRef.current?.offsetParent?.nextSibling?.focus();
    },
    [clearId, isOpen, isMenuFocused]
  );

  const handleMenuItemClick = useCallback(
    (event, menuItem) => {
      inputValue.updateToOption(menuItem);
      onMenuItemClick?.(event, menuItem);
      handleDismissMenu();
    },
    [handleDismissMenu, inputValue, onMenuItemClick]
  );

  const handleReturnToInput = useCallback(() => inputRef?.current?.focus(), []);

  /**
   * Callbacks passed to input
   * handleInputChange: When input changes by user.
   * handleClearInputValue: When clear button is triggered.
   * - Will only clear the input value by default.
   * - If onMenuItemClick is present will also trigger onMenuItemClick with an empty string to clear out selected value (presumably - since this is controlled by parent).
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
    onMenuItemClick?.(null, '');
    handleReturnToInput();
  }, [handleReturnToInput, inputValue, onMenuItemClick]);

  const handleTabClearButton = useCallback(() => {
    isOpen.set(false);
    isMenuFocused.set(false);
  }, [isOpen, isMenuFocused]);

  const focusSentToList = useCallback(() => isMenuFocused.set(true), [
    isMenuFocused,
  ]);

  /**
   * handleInputKeyPress
   * Watch keyDown of input for keys that change interaction
   * ESC: Close menu
   * TAB:
   * - Close menu on tab if inputValue length is 0
   * ARROW DOWN: Send focus to menu list
   * ENTER: Trigger menuItemClick
   */
  const handleInputKeyPress = useCallback(
    (event) => {
      const { key } = event;
      if (key === 'Escape') {
        isOpen.set(false);
      } else if (key === 'Tab') {
        // if inputValue exists then there is a clear button
        if (inputValue.value.length === 0) {
          isMenuFocused.set(false);
          isOpen.set(false);
        }
      } else if (key === 'ArrowDown') {
        focusSentToList();
      } else if (key === 'Enter') {
        handleMenuItemClick(event, inputValue.value);
      }
    },
    [isOpen, inputValue, isMenuFocused, focusSentToList, handleMenuItemClick]
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
        isFlexibleValue={true}
        isOpen={isOpen?.value}
        listId={listId}
        ref={inputRef}
        {...rest}
      />

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
