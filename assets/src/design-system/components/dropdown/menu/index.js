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
import { useCallback, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { DROPDOWN_ITEM, MENU_OPTIONS, DROPDOWN_VALUE_TYPE } from '../types';
import {
  EmptyList,
  GroupLabel,
  GroupList,
  MenuContainer,
  List,
} from './components';
import useDropdownMenu from './useDropdownMenu';
import { getInset } from './utils';
import { DefaultListItem } from './defaultListItem';

export const DropdownMenu = ({
  anchorHeight,
  dropdownHeight,
  emptyText,
  menuStylesOverride,
  hasMenuRole,
  isRTL,
  items = [],
  listId,
  onMenuItemClick,
  onDismissMenu,
  renderItem = DefaultListItem,
  subsectionItems,
  activeValue,
  menuAriaLabel,
}) => {
  const ListItem = renderItem;
  const listRef = useRef();
  const optionsRef = useRef([]);

  const handleMenuItemSelect = useCallback(
    (event, { value }) => onMenuItemClick(event, value),
    [onMenuItemClick]
  );

  const { focusedIndex, listLength } = useDropdownMenu({
    activeValue,
    handleMenuItemSelect,
    isRTL,
    items: subsectionItems || items,
    listRef,
    onDismissMenu,
  });

  useEffect(() => {
    const listEl = listRef.current;
    if (!listEl || focusedIndex === null) {
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
  }, [focusedIndex]);

  const renderMenuLabel = (label) => {
    return (
      <GroupLabel id={`dropdownMenuLabel-${label}`} role="presentation">
        {label}
      </GroupLabel>
    );
  };

  const renderMenuItem = useCallback(
    (item, itemIndex, groupIndex = 0) => {
      const isSelected = item.value === activeValue;
      const itemInset = getInset(items, groupIndex, itemIndex);
      return (
        <ListItem
          aria-posinset={itemInset}
          aria-selected={isSelected}
          aria-setsize={listLength}
          id={`dropdownMenuItem-${item.value}`}
          key={item.value}
          role={hasMenuRole ? 'menuitem' : 'option'}
          onClick={(event) => handleMenuItemSelect(event, item)}
          tabIndex={0}
          ref={(el) => (optionsRef.current[itemInset] = el)}
          option={item}
          isSelected={isSelected}
        />
      );
    },
    [activeValue, handleMenuItemSelect, hasMenuRole, items, listLength]
  );

  const MenuContent = useMemo(() => {
    if (!items || items.length === 0) {
      return <EmptyList>{emptyText}</EmptyList>;
    } else if (subsectionItems) {
      return items.map((itemGroup, groupIndex) => {
        const groupLabelId = `group-${uuidv4()}`;
        return (
          <GroupList
            key={itemGroup.label || `menuGroup_${groupIndex}`}
            aria-labelledby={groupLabelId}
            role="group"
          >
            {itemGroup?.label && renderMenuLabel(itemGroup.label)}
            {itemGroup?.options.map((item, itemIndex) =>
              renderMenuItem(item, itemIndex, groupIndex)
            )}
          </GroupList>
        );
      });
    } else {
      return <List role={'group'}>{items.map(renderMenuItem)}</List>;
    }
  }, [emptyText, items, renderMenuItem, subsectionItems]);

  return (
    <MenuContainer
      id={listId}
      anchorHeight={anchorHeight}
      dropdownHeight={dropdownHeight}
      styleOverride={menuStylesOverride}
      ref={listRef}
      role={hasMenuRole ? 'menu' : 'listbox'}
      aria-label={menuAriaLabel}
    >
      {MenuContent}
    </MenuContainer>
  );
};

DropdownMenu.propTypes = {
  anchorHeight: PropTypes.number,
  dropdownHeight: PropTypes.number,
  emptyText: PropTypes.string,
  menuStylesOverride: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  hasMenuRole: PropTypes.bool,
  isRTL: PropTypes.bool,
  items: MENU_OPTIONS,
  listId: PropTypes.string.isRequired,
  menuAriaLabel: PropTypes.string,
  onMenuItemClick: PropTypes.func.isRequired,
  onDismissMenu: PropTypes.func.isRequired,
  renderItem: PropTypes.object,
  activeValue: DROPDOWN_VALUE_TYPE,
  subsectionItems: PropTypes.oneOfType([
    PropTypes.arrayOf(DROPDOWN_ITEM),
    PropTypes.bool,
  ]),
};
