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
import styled from 'styled-components';
import { useEffect, useState, useRef } from 'react';

/**
 * Internal dependencies
 */
import { KEYS, Z_INDEX } from '../../constants';
import { DROPDOWN_ITEM_PROP_TYPE } from '../types';
import { TypographyPresets } from '../typography';

export const Menu = styled.ul`
  ${({ theme, isOpen }) => `
    width: 100%;
    max-height: 300px;
    overflow-y: scroll;
    align-items: flex-start;
    background-color: ${theme.colors.white};
    box-shadow: ${theme.expandedTypeahead.boxShadow};
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    margin: 5px 0 0;
    opacity: ${isOpen ? 1 : 0};
    padding: 5px 0;
    pointer-events: ${isOpen ? 'auto' : 'none'};
    z-index: ${Z_INDEX.TYPEAHEAD_OPTIONS};
  `}
`;
Menu.propTypes = {
  isOpen: PropTypes.bool,
};

const MenuItem = styled.li`
  ${TypographyPresets.Small};
  ${({ theme, isDisabled, itemBgColor }) => `
    padding: 10px 20px;
    background-color: ${itemBgColor ? theme.colors[itemBgColor] : 'none'};
    color: ${theme.colors.gray700};
    cursor: ${isDisabled ? 'default' : 'pointer'};
    display: flex;
    width: 100%;
  `}
`;
MenuItem.propTypes = {
  isDisabled: PropTypes.bool,
  itemBgColor: PropTypes.oneOf('gray25', 'gray50'),
};

const MenuItemContent = styled.span`
  align-self: flex-start;
  height: 100%;
  margin: auto 0;
`;

const TypeaheadOptions = ({
  currentSelection,
  isOpen,
  items = [],
  onSelect,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isOptionMenuAlreadyOpen, setIsOptionMenuAlreadyOpen] = useState(false);
  const listRef = useRef(null);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (event) => {
        switch (event.key) {
          case KEYS.UP:
            event.preventDefault();
            if (hoveredIndex > 0) {
              setHoveredIndex(hoveredIndex - 1);
              if (listRef.current) {
                listRef.current.children[hoveredIndex - 1].scrollIntoView();
              }
            }
            break;

          case KEYS.DOWN:
            event.preventDefault();
            if (hoveredIndex < items.length - 1) {
              setHoveredIndex(hoveredIndex + 1);
              if (listRef.current) {
                listRef.current.children[hoveredIndex + 1].scrollIntoView();
              }
            }
            break;

          case KEYS.ENTER:
            event.preventDefault();
            if (onSelect) {
              onSelect(items[hoveredIndex]);
            }
            break;

          default:
            break;
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [hoveredIndex, items, onSelect, isOpen]);

  useEffect(() => {
    if (listRef.current && listRef.current.children?.[0]) {
      listRef.current.children[0].focus();
    }
  }, []);

  // we only want to set an existing value for currentSelection when the dropdown is newly opened
  useEffect(() => {
    if (!isOptionMenuAlreadyOpen) {
      setIsOptionMenuAlreadyOpen(true);

      const selectionToCheckFor =
        currentSelection && currentSelection.toLowerCase().trim();
      const existingValueOnMenuOpen = selectionToCheckFor
        ? items.findIndex(
            (item) =>
              (item.value &&
                item.value.toLowerCase() === selectionToCheckFor) ||
              item.label.toLowerCase() === selectionToCheckFor
          )
        : -1;

      if (existingValueOnMenuOpen > -1) {
        setSelectedIndex(existingValueOnMenuOpen);
      }
    }
  }, [isOptionMenuAlreadyOpen, currentSelection, items]);

  // when selectedIndex is updated above we want to scroll it into view and focus it
  useEffect(() => {
    if (listRef.current && listRef.current.children) {
      const selectedItem = listRef.current.children[selectedIndex];
      selectedItem?.scrollIntoView();
      selectedItem?.focus();
    }
  }, [selectedIndex]);

  const renderMenuItem = (item, index) => {
    const itemIsDisabled = !item.value && item.value !== 0;
    const itemIsSelected = index === selectedIndex;
    const itemIsHovering = index === hoveredIndex;
    const itemBgColor =
      (itemIsSelected && 'gray50') || (itemIsHovering && 'gray25');

    return (
      <MenuItem
        key={`${item.value}_${index}`}
        itemBgColor={itemBgColor}
        onClick={() => !itemIsDisabled && onSelect(item)}
        onMouseEnter={() => setHoveredIndex(index)}
        isDisabled={itemIsDisabled}
      >
        <MenuItemContent>{item.label}</MenuItemContent>
      </MenuItem>
    );
  };

  return (
    <Menu isOpen={isOpen} ref={listRef}>
      {items.map((item, index) => {
        return renderMenuItem(item, index);
      })}
    </Menu>
  );
};

TypeaheadOptions.propTypes = {
  currentSelection: PropTypes.string,
  items: PropTypes.arrayOf(DROPDOWN_ITEM_PROP_TYPE).isRequired,
  isOpen: PropTypes.bool,
  onSelect: PropTypes.func,
};

export default TypeaheadOptions;
