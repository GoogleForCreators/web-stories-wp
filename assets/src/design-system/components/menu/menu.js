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
import { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { MENU_OPTIONS, DROP_DOWN_VALUE_TYPE } from './types';
import { MenuContainer } from './components';
import useDropDownMenu from './useDropDownMenu';
import { EmptyList, ListGroupings } from './list';

/**
 *
 * @param {Object} props All props.
 * @param {number} props.dropDownHeight Sets a specific height as max for the list to display in a given container. Defaults to DEFAULT_DROPDOWN_HEIGHT.
 * @param {string} props.emptyText If the array of options is empty this text will display.
 * @param {Object} props.menuStylesOverride should be formatted as a css template literal with styled components. Gives access to completely overriding dropdown menu styles (container div > ul > li).
 * @param {Function} props.handleReturnToParent If present, when focus is on first option and user keys up, this function will be triggered, meant to pass function to controlling element.
 * @param {boolean} props.hasMenuRole If true, the aria role used for the list is 'menu' instead of 'listbox'.
 * @param {boolean} props.isMenuFocused Defaults to true, if false will prevent useEffect from passing focus to menu items, meant to aid search and typeahead utility.
 * @param {boolean} props.isRTL If true, arrow left will trigger down, arrow right will trigger up.
 * @param {Array} props.options All options, should contain either 1) objects with a label, value, anything else you need can be added and accessed through renderItem or 2) Objects containing a label and options, where options is structured as first option with array of objects containing at least value and label - this will create a nested list. These options need to be sanitized with utils/getOptions.
 * @param {string} props.listId ID that comes from parent component that attaches this list to that parent. Used for a11y.
 * @param {Function} props.onMenuItemClick Triggered when a user clicks or presses 'Enter' on an option.
 * @param {Function} props.onDismissMenu Triggered when a user escapes a menu or clicks outside of it.
 * @param {Function} props.renderItem If present when menu is open, will override the base list items rendered for each option, the entire item and whether it is selected will be returned and allow you to style list items internal to a list item without affecting dropdown functionality.
 * @param {string} props.activeValue the selected value of the dropDown. Should correspond to a value in the options array of objects.
 * @param {string} props.menuAriaLabel Specific label to use as menu's aria label for screen readers.
 * @param {string} props.parentId if in a dropDownMenu, this is the id associated with the button that controls when the menu is visible.
 *
 */

const Menu = ({
  dropDownHeight,
  emptyText,
  menuStylesOverride,
  hasMenuRole,
  handleReturnToParent,
  isMenuFocused = true,
  isRTL,
  options = [],
  listId,
  onMenuItemClick,
  onDismissMenu,
  renderItem,
  activeValue,
  menuAriaLabel,
  parentId,
}) => {
  const listRef = useRef();
  const optionsRef = useRef([]);

  const handleMenuItemSelect = useCallback(
    (event, { value }) => onMenuItemClick(event, value),
    [onMenuItemClick]
  );

  const { focusedIndex, listLength } = useDropDownMenu({
    activeValue,
    handleMenuItemSelect,
    isRTL,
    options,
    listRef,
    onDismissMenu,
    handleReturnToParent,
  });

  useEffect(() => {
    const listEl = listRef?.current;

    if (!listEl || focusedIndex === null || !isMenuFocused) {
      return;
    }

    if (focusedIndex === -1) {
      listEl.scrollTo(0, 0);
      return;
    }

    const highlighedOptionEl = optionsRef.current[focusedIndex];
    if (!highlighedOptionEl) {
      return;
    }

    highlighedOptionEl.focus();
    listEl.scrollTo(0, highlighedOptionEl.offsetTop - listEl.clientHeight / 2);
  }, [focusedIndex, isMenuFocused]);

  return (
    <MenuContainer
      id={listId}
      dropDownHeight={dropDownHeight}
      styleOverride={menuStylesOverride}
      ref={listRef}
      aria-label={menuAriaLabel}
      aria-labelledby={parentId}
      aria-expanded="true"
    >
      {!options || options.length === 0 ? (
        <EmptyList emptyText={emptyText} />
      ) : (
        <ListGroupings
          options={options}
          activeValue={activeValue}
          listId={listId}
          listLength={listLength}
          hasMenuRole={hasMenuRole}
          handleMenuItemSelect={handleMenuItemSelect}
          renderItem={renderItem}
          optionsRef={optionsRef}
        />
      )}
    </MenuContainer>
  );
};

Menu.propTypes = {
  dropDownHeight: PropTypes.number,
  emptyText: PropTypes.string,
  menuStylesOverride: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  hasMenuRole: PropTypes.bool,
  handleReturnToParent: PropTypes.func,
  isMenuFocused: PropTypes.bool,
  isRTL: PropTypes.bool,
  options: MENU_OPTIONS,
  listId: PropTypes.string.isRequired,
  menuAriaLabel: PropTypes.string,
  onMenuItemClick: PropTypes.func.isRequired,
  onDismissMenu: PropTypes.func.isRequired,
  renderItem: PropTypes.object,
  activeValue: DROP_DOWN_VALUE_TYPE,
  parentId: PropTypes.string.isRequired,
};

export { Menu };
