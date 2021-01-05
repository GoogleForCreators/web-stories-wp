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

// focus should stay on input until arrows are used
// activeOption is the selected value
// inputValue is the actual value in the input
// activeOption is preserved through typing,
// in editor: value must be selected through menu (strict mode?)
// in dashboard: value doesn't have to match a menu option

/**
 *
 * @param {Object} props All props.
 * @param {string} props.ariaLabel Specific label to use as select button's aria label only.
 * @param {boolean} props.disabled If true, menu will not be openable
 * @param {string} props.emptyText If the array of options is empty this text will display when menu is expanded.
 * @param {string} props.hint Hint text to display below a dropdown (optional). If not present, no hint text will display.
 * @param {boolean} props.isKeepMenuOpenOnSelection If true, when a new selection is made the internal functionality to close the menu will not fire, by default is false.
 * @param {boolean} props.isRTL If true, arrow left will trigger down, arrow right will trigger up.
 * @param {Object} props.menuStylesOverride should be formatted as a css template literal with styled components. Gives access to completely overriding dropdown menu styles (container div > ul > li).
 * @param {Function} props.onMenuItemClick Triggered when a user clicks or presses 'Enter' on an option.
 * @param {Array} props.options All options, should contain either 1) objects with a label, value, anything else you need can be added and accessed through renderItem or 2) Objects containing a label and options, where options is structured as first option with array of objects containing at least value and label - this will create a nested list.
 * @param {number} props.popupFillWidth Allows for an override of how much of popup width to take up for dropDown.
 * @param {number} props.popupZIndex Allows for an override of the default popup z index (2).
 * @param {string} props.placement placement passed to popover for where menu should expand, defaults to "bottom_end".
 * @param {Function} props.renderItem If present when menu is open, will override the base list items rendered for each option, the entire item and whether it is selected will be returned and allow you to style list items internal to a list item without affecting dropdown functionality.
 * @param {string} props.selectedValue the selected value of the dropDown. Should correspond to a value in the options array of objects.
 *
 */

export const Typeahead = ({
  handleTypeaheadValueChange,
  ariaInputLabel = DEFAULT_ARIA_INPUT_LABEL,
  ariaClearLabel = DEFAULT_ARIA_CLEAR_LABEL,
  disabled,
  hasError,
  hint,
  isFlexibleValue, // new, so that partial inputs can be preserved or clear button clears selectedValue as well as input
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

  // Callbacks that begin typeahead interaction

  // When input is given focus, expand menu.
  const handleInputFocus = useCallback(() => {
    isOpen.set((prevIsOpen) => !prevIsOpen);
  }, [isOpen]);

  // When input is clicked, give menu focus and expand menu.
  const handleInputClick = useCallback(
    (event) => {
      event.preventDefault();

      isMenuFocused.set((prevIsMenuFocused) => !prevIsMenuFocused);
      isOpen.set((prevIsOpen) => !prevIsOpen);
    },
    [isOpen, isMenuFocused]
  );

  // Callbacks tied to input change

  // Control input changes by user.
  // Ensure menu is open and focus is maintained to input.
  const handleInputChange = useCallback(
    ({ target }) => {
      inputValue.set(target.value);

      if (target.value.length > 0 && !isOpen.value) {
        isOpen.set(!isOpen.value);
        isMenuFocused.value && isMenuFocused.set(false);
      }
    },
    [inputValue, isOpen, isMenuFocused]
  );

  // Triggered by clicking clear button.
  // Will only clear the input value by default.
  // if isFlexibleValue and onMenuItemClick are present will also trigger onMenuItemClick with an empty string to clear out selected value (presumably - since this is controlled by parent).
  const handleClearInputValue = useCallback(() => {
    if (isFlexibleValue) {
      inputValue.set('');
      onMenuItemClick && onMenuItemClick(null, '');
    } else {
      inputValue.set(activeOption?.label || '');
    }
  }, [activeOption?.label, inputValue, isFlexibleValue, onMenuItemClick]);

  const focusSentToList = useCallback(() => {
    isMenuFocused.set(true);
  }, [isMenuFocused]);

  // Watch keyDown of input for keys that change interaction.
  // Close menu on escape or tab.
  // Shift focus to active list item or first list item on arrow down.
  const handleInputKeyPress = useCallback(
    ({ key }) => {
      if (key === 'Escape' || key === 'Tab') {
        isOpen.set(false);
      } else if (key === 'ArrowDown') {
        focusSentToList();
      }
    },
    [isOpen, focusSentToList]
  );

  // Callbacks passed to menu

  // dismissMenu as sent to menu for focusOut hook.
  const handleDismissMenu = useCallback(
    (event) => {
      // don't dismiss menu if clicking on clear button while menu is open
      if (event?.srcElement.id === clearId) {
        return;
      }
      isOpen.set(false);
      inputRef.current.focus();
    },
    [clearId, isOpen]
  );

  const handleMenuItemClick = useCallback(
    (event, menuItem) => {
      onMenuItemClick && onMenuItemClick(event, menuItem);

      if (!isKeepMenuOpenOnSelection) {
        handleDismissMenu();
      }
    },
    [handleDismissMenu, isKeepMenuOpenOnSelection, onMenuItemClick]
  );

  const handleReturnToParent = useCallback(() => {
    inputRef?.current?.focus();
  }, []);

  const listId = useMemo(() => `list-${uuidv4()}`, []);
  const inputId = useMemo(() => `select-button-${uuidv4()}`, []);
  const clearId = useMemo(() => `clear-button-${uuidv4()}`, []);

  return (
    <DropDownContainer>
      <TypeaheadInput
        ariaInputLabel={ariaInputLabel}
        ariaClearLabel={ariaClearLabel}
        clearId={clearId}
        disabled={disabled}
        hasError={hasError}
        id={inputId}
        inputValue={inputValue?.value}
        isFlexibleValue={isFlexibleValue}
        isOpen={isOpen.value}
        listId={listId}
        name={inputId}
        onChange={handleInputChange}
        onClick={handleInputClick}
        onFocus={handleInputFocus}
        onKeyDown={handleInputKeyPress}
        handleClearInputValue={handleClearInputValue}
        placeholder={placeholder}
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
            handleReturnToParent={handleReturnToParent}
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
  options: MENU_OPTIONS,
  onMenuItemClick: PropTypes.func,
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
