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
import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
/**
 * Internal dependencies
 */
import { KEYS } from '../../constants';
import { DROPDOWN_ITEM_PROP_TYPE } from '../types';

export const MenuContainer = styled.ul`
  align-items: flex-start;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  margin: 0;
  min-width: 210px;
  overflow: hidden;
  padding: 5px 0;
  pointer-events: auto;
`;
MenuContainer.propTypes = {
  isOpen: PropTypes.bool,
};

export const MenuItem = styled.li(
  ({ theme, isDisabled, isHovering }) => `
    padding: 5px 25px;
    background: ${isHovering && !isDisabled ? theme.colors.gray25 : 'none'};
    color: ${isDisabled ? theme.colors.gray400 : theme.colors.gray700};
    cursor: ${isDisabled ? 'default' : 'pointer'};
    display: flex;
    font-family: ${theme.fonts.popoverMenu.family};
    font-size: ${theme.fonts.popoverMenu.size}px;
    line-height: ${theme.fonts.popoverMenu.lineHeight}px;
    font-weight: ${theme.fonts.popoverMenu.weight};
    letter-spacing: ${theme.fonts.popoverMenu.letterSpacing}em;
    width: 100%;
  `
);

MenuItem.propTypes = {
  isDisabled: PropTypes.bool,
  isHovering: PropTypes.bool,
};

const MenuItemContent = styled.span`
  align-self: flex-start;
  height: 100%;
  margin: auto 0;
`;

const Separator = styled.li`
  height: 1px;
  background: ${({ theme }) => theme.colors.gray50};
  width: 100%;
`;

const Menu = ({ isOpen, items, onSelect }) => {
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
                listRef.current.scrollToItem(hoveredIndex - 1);
              }
            }
            break;

          case KEYS.DOWN:
            event.preventDefault();
            if (hoveredIndex < items.length - 1) {
              setHoveredIndex(hoveredIndex + 1);
              if (listRef.current) {
                listRef.current.scrollToItem(hoveredIndex + 1);
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
      listRef.current.scrollToItem(0);
    }
    setHoveredIndex(0);
  }, [items]);

  const renderMenuItem = useCallback(
    (item, index) => {
      const itemIsDisabled = !item.value && item.value !== 0;
      return (
        <MenuItem
          key={`${item.value}_${index}`}
          isHovering={index === hoveredIndex}
          onClick={() => !itemIsDisabled && onSelect && onSelect(item)}
          onMouseEnter={() => setHoveredIndex(index)}
          isDisabled={itemIsDisabled}
        >
          <MenuItemContent>{item.label}</MenuItemContent>
        </MenuItem>
      );
    },
    [hoveredIndex, onSelect]
  );

  const renderSeparator = useCallback((index) => {
    return <Separator key={`separator-${index}`} />;
  }, []);

  return (
    <MenuContainer>
      {items.map((item, index) => {
        if (item.separator) {
          return renderSeparator(index);
        }
        return renderMenuItem(item, index);
      })}
    </MenuContainer>
  );
};

export const MenuProps = {
  items: PropTypes.arrayOf(DROPDOWN_ITEM_PROP_TYPE).isRequired,
  isOpen: PropTypes.bool,
  onSelect: PropTypes.func,
};

Menu.propTypes = MenuProps;

export default Menu;
