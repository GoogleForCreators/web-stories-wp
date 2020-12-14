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
import { Checkmark } from '../../../icons';
import { DROPDOWN_ITEMS, DROPDOWN_VALUE_TYPE } from '../types';
import { MenuContainer, List, ListItem } from './components';
import useDropdownMenu from './useDropdownMenu';

export const DropdownMenu = ({
  anchorHeight,
  dropdownHeight,
  menuStylesOverride,
  hasMenuRole,
  isRTL,
  items,
  onMenuItemClick,
  onDismissMenu,
  renderItem,
  activeValue,
}) => {
  const listRef = useRef();

  const handleMenuItemSelect = useCallback(
    (event, { value }) => onMenuItemClick(event, value),
    [onMenuItemClick]
  );

  const { focusedIndex } = useDropdownMenu({
    activeValue,
    handleMenuItemSelect,
    isRTL,
    items,
    listRef,
    onDismissMenu,
  });

  useEffect(() => {
    if (listRef.current && focusedIndex !== null) {
      listRef.current?.children?.[focusedIndex]?.focus();
    }
  }, [focusedIndex]);

  const renderMenuItem = (item) => {
    const isSelected = item.value === activeValue;

    return (
      <ListItem
        id={`dropdownMenuItem-${item.value}`}
        key={item.value}
        role={hasMenuRole ? 'menuitem' : 'option'}
        onClick={(event) => handleMenuItemSelect(event, item)}
        tabIndex={0}
      >
        {renderItem ? (
          renderItem(item, isSelected)
        ) : (
          <span>
            {isSelected && <Checkmark />}
            {item.label}
          </span>
        )}
      </ListItem>
    );
  };

  return (
    <MenuContainer
      anchorHeight={anchorHeight}
      dropdownHeight={dropdownHeight}
      styleOverride={menuStylesOverride}
    >
      <List ref={listRef} role={hasMenuRole ? 'menu' : 'listbox'}>
        {items.map(renderMenuItem)}
      </List>
    </MenuContainer>
  );
};

DropdownMenu.propTypes = {
  anchorHeight: PropTypes.number,
  dropdownHeight: PropTypes.number,
  menuStylesOverride: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  hasMenuRole: PropTypes.bool,
  isRTL: PropTypes.bool,
  items: DROPDOWN_ITEMS,
  onMenuItemClick: PropTypes.func.isRequired,
  onDismissMenu: PropTypes.func.isRequired,
  renderItem: PropTypes.func,
  activeValue: DROPDOWN_VALUE_TYPE,
};
