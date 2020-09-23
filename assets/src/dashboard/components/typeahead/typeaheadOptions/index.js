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
import { useEffect, useState, forwardRef } from 'react';

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
          if (focusedIndex > 0) {
            setFocusedIndex(focusedIndex - 1);
            if (listRef.current) {
              listRef.current.children[focusedIndex - 1].focus();
            }
          }
          break;

        case KEYS.DOWN:
          event.preventDefault();
          if (focusedIndex < items.length - 1) {
            setFocusedIndex(focusedIndex + 1);
            if (listRef.current) {
              listRef.current.children[focusedIndex + 1].focus();
            }
          }
          break;

        case KEYS.ENTER:
          event.preventDefault();
          if (onSelect) {
            onSelect(items[focusedIndex]);
          }
          break;

        default:
          break;
      }
    };

    const listRefEl = listRef.current;
    listRefEl.addEventListener('keydown', handleKeyDown);
    return () => listRefEl.removeEventListener('keydown', handleKeyDown);
  }, [items, onSelect, listRef, handleFocusToInput, focusedIndex]);

  // when selectedIndex is updated above we want to scroll it into view and focus it
  useEffect(() => {
    if (listRef.current && listRef.current.children) {
      const indexToFocus = selectedIndex > -1 ? selectedIndex : 0;
      const focusedItem = listRef.current.children[indexToFocus];
      setFocusedIndex(indexToFocus);
      focusedItem?.scrollIntoView();
    }
  }, [listRef, selectedIndex]);

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
        isDisabled={itemIsDisabled}
        aria-disabled={Boolean(itemIsDisabled)}
      >
        <MenuItemContent>{item.label}</MenuItemContent>
      </MenuItem>
    );
  };

  return (
    <Menu isOpen ref={listRef}>
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
