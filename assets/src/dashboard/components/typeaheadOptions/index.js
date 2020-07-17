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
  ${({ theme, isDisabled, isHovering }) => `
    padding: 10px 20px;
    background: ${isHovering ? theme.colors.gray25 : 'none'};
    color: ${theme.colors.gray700};
    cursor: ${isDisabled ? 'default' : 'pointer'};
    display: flex;
    width: 100%;
  `}
`;
MenuItem.propTypes = {
  isDisabled: PropTypes.bool,
  isHovering: PropTypes.bool,
};

const MenuItemContent = styled.span`
  align-self: flex-start;
  height: 100%;
  margin: auto 0;
`;

const TypeaheadOptions = ({ isOpen, items, onSelect }) => {
  const [hoveredIndex, setHoveredIndex] = useState(0);
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
    if (listRef.current) {
      listRef.current.children[0].focus();
    }
    setHoveredIndex(0);
  }, [items]);

  const renderMenuItem = (item, index) => {
    const itemIsDisabled = !item.value && item.value !== 0;
    return (
      <MenuItem
        key={`${item.value}_${index}`}
        isHovering={index === hoveredIndex}
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
  items: PropTypes.arrayOf(DROPDOWN_ITEM_PROP_TYPE).isRequired,
  isOpen: PropTypes.bool,
  onSelect: PropTypes.func,
};

export default TypeaheadOptions;
