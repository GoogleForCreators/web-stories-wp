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
import PropTypes from 'prop-types';
import { forwardRef, useEffect, useState } from 'react';

/**
 * Internal dependencies
 */
import { KEYS } from '../../../constants';
import { DROPDOWN_ITEM_PROP_TYPE } from '../../types';
import { Menu, MenuItem, MenuItemContent } from './components';

const TypeaheadOptions = forwardRef(function TypeaheadOptions(
  { handleFocusToInput, selectedIndex, items = [], onSelect },
  listRef
) {
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case KEYS.UP:
          event.preventDefault();
          if (focusedIndex === 0) {
            handleFocusToInput();
          }
          if (focusedIndex > 0 && listRef.current) {
            listRef.current.children[focusedIndex - 1].focus();
          }
          break;

        case KEYS.DOWN:
          event.preventDefault();
          if (focusedIndex < items.length - 1 && listRef.current) {
            listRef.current.children[focusedIndex + 1].focus();
          }
          break;

        case KEYS.ENTER:
          event.preventDefault();
          if (onSelect) {
            onSelect(items[focusedIndex]);
          }
          break;

        case KEYS.ESC:
          event.preventDefault();
          handleFocusToInput();
          break;

        default:
          break;
      }
    };

    const listRefEl = listRef?.current;
    listRefEl?.addEventListener('keydown', handleKeyDown);
    return () => listRefEl?.removeEventListener('keydown', handleKeyDown);
  }, [items, onSelect, listRef, handleFocusToInput, focusedIndex]);

  useEffect(() => {
    setFocusedIndex(selectedIndex);
    setHoveredIndex(selectedIndex);
  }, [selectedIndex]);

  const renderMenuItem = (item, index) => {
    const itemIsDisabled = !item.value && item.value !== 0;
    const itemIsSelected = index === selectedIndex;
    const itemIsHovering = index === hoveredIndex;
    const itemBgColor =
      (itemIsSelected && 'gray50') || (itemIsHovering && 'gray25');

    return (
      <MenuItem
        tabIndex={0}
        key={`${item.value}_${index}`}
        itemBgColor={itemBgColor}
        onClick={() => !itemIsDisabled && onSelect(item)}
        onMouseEnter={() => setHoveredIndex(index)}
        onFocus={(event) => {
          // Prevent event bubbling when we are trying to avoid the menu container gaining focus to reset the menu's focused state
          event.stopPropagation();
          setFocusedIndex(index);
        }}
        isDisabled={itemIsDisabled}
        aria-disabled={Boolean(itemIsDisabled)}
      >
        <MenuItemContent>{item.label}</MenuItemContent>
      </MenuItem>
    );
  };

  return (
    <Menu isOpen ref={listRef} data-testid="typeahead-options">
      {items.map((item, index) => {
        return renderMenuItem(item, index);
      })}
    </Menu>
  );
});

TypeaheadOptions.propTypes = {
  selectedIndex: PropTypes.number,
  handleFocusToInput: PropTypes.func,
  items: PropTypes.arrayOf(DROPDOWN_ITEM_PROP_TYPE).isRequired,
  onSelect: PropTypes.func,
};

export default TypeaheadOptions;
