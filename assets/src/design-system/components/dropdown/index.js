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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useDebouncedCallback } from 'use-debounce';
import { v4 as uuidv4 } from 'uuid';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Popup, PLACEMENT } from '../popup';
import { DropdownSelect } from './select';
import { DropdownMenu } from './menu';
import { MENU_OPTIONS } from './types';

const DropdownContainer = styled.div``;

/**
 *
 * @param {Object} props All props.
 * @param {string} props.ariaLabel Specific label to use as select button's aria label only.
 * @param {string} props.emptyText If the array of items is empty this text will display when menu is expanded.
 * @param {string} props.hint Hint text to display below a dropdown (optional). If not present, no hint text will display.
 * @param {boolean} props.isKeepMenuOpenOnSelection If true, when a new selection is made the internal functionality to close the menu will not fire, by default is false.
 * @param {boolean} props.disabled If true, menu will not be openable
 * @param {string} props.dropdownLabel Text shown in button with selected value's label or placeholder. Will be used as aria label if no separate ariaLabel is passed in.
 * @param {boolean} props.isRTL If true, arrow left will trigger down, arrow right will trigger up.
 * @param {Array} props.items All options, should contain objects with a label, value, anything else you need can be added and accessed through renderItem.
 * @param {Object} props.menuStylesOverride should be formatted as a css template literal with styled components. Gives access to completely overriding dropdown menu styles (container div > ul > li).
 * @param {Function} props.onMenuItemClick Triggered when a user clicks or presses 'Enter' on an option.
 * @param {string} props.placement placement passed to popover for where menu should expand, defaults to "bottom_end".
 * @param {Function} props.renderItem If present when menu is open, will override the base list items rendered for each option, the entire item and whether it is selected will be returned and allow you to style list items internal to a list item without affecting dropdown functionality.
 * @param {string} props.selectedValue the selected value of the dropdown. Should correspond to a value in the options array of objects.
 *
 */

export const Dropdown = ({
  ariaLabel,
  dropdownLabel,
  hint,
  isKeepMenuOpenOnSelection,
  disabled,
  items = [],
  onMenuItemClick,
  placement = PLACEMENT.BOTTOM_END,
  selectedValue = '',
  ...rest
}) => {
  const selectRef = useRef();

  const [isOpen, _setIsOpen] = useState(false);
  const [anchorHeight, setAnchorHeight] = useState(null);

  const subsectionItems = useMemo(
    () =>
      items.some((item) => item.options) &&
      items.reduce((prev, current) => {
        if (!current.options) {
          return prev;
        }
        return prev.concat(...current.options);
      }, []),
    [items]
  );

  const [setIsOpen] = useDebouncedCallback(_setIsOpen, 300, {
    leading: true,
    trailing: false,
  });

  const handleSelectClick = useCallback(
    (event) => {
      event.preventDefault();
      setIsOpen((prevIsOpen) => !prevIsOpen);
    },
    [setIsOpen]
  );

  const handleDismissMenu = useCallback(() => {
    setIsOpen(false);
    selectRef.current.focus();
  }, [setIsOpen]);

  const handleMenuItemClick = useCallback(
    (event, menuItem) => {
      onMenuItemClick && onMenuItemClick(event, menuItem);

      if (!isKeepMenuOpenOnSelection) {
        handleDismissMenu();
      }
    },
    [handleDismissMenu, isKeepMenuOpenOnSelection, onMenuItemClick]
  );

  const activeItem = useMemo(() => {
    if (!selectedValue) {
      return null;
    }
    return [...(subsectionItems ? subsectionItems : items)].find((item) => {
      return item?.value?.toString() === selectedValue.toString();
    });
  }, [items, selectedValue, subsectionItems]);

  useEffect(() => {
    if (selectRef?.current) {
      const { height = null } = selectRef?.current?.getBoundingClientRect();
      setAnchorHeight(height);
    }
  }, []);

  const listId = `list-${uuidv4()}`;
  return (
    <DropdownContainer>
      <DropdownSelect
        activeItemLabel={activeItem?.label}
        isOpen={isOpen}
        disabled={disabled}
        onSelectClick={handleSelectClick}
        ref={selectRef}
        {...rest}
      />
      {!disabled && (
        <Popup
          anchor={selectRef}
          isOpen={isOpen}
          placement={placement}
          fillWidth={240}
        >
          <DropdownMenu
            activeValue={activeItem?.value}
            anchorHeight={anchorHeight}
            items={items}
            listId={listId}
            menuAriaLabel={sprintf(
              /* translators: %s: dropdown aria label or general dropdown label if there is no specific aria label. */
              __('%s Option List Selector', 'web-stories'),
              ariaLabel || dropdownLabel
            )}
            onDismissMenu={handleDismissMenu}
            onMenuItemClick={handleMenuItemClick}
            subsectionItems={subsectionItems}
            {...rest}
          />
        </Popup>
      )}
      {hint && <p>{hint}</p>}
    </DropdownContainer>
  );
};

Dropdown.propTypes = {
  ariaLabel: PropTypes.string,
  disabled: PropTypes.bool,
  dropdownLabel: PropTypes.string,
  hint: PropTypes.string,
  isKeepMenuOpenOnSelection: PropTypes.bool,
  isRTL: PropTypes.bool,
  items: MENU_OPTIONS,
  menuStylesOverride: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onMenuItemClick: PropTypes.func,
  placeholder: PropTypes.string,
  placement: PropTypes.string,
  renderItem: PropTypes.object,
  selectedValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
  ]),
};
