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
import { useEffect, useState, useRef, useCallback } from 'react';

/**
 * Internal dependencies
 */
import { KEYS, Z_INDEX } from '../../constants';

export const DROPDOWN_MENU_DIRECTIONS = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
};

export const Menu = styled.ul`
  align-items: flex-start;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  margin: ${({ framelessButton }) => (framelessButton ? '0' : '20px 0')};
  min-width: 210px;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  overflow: hidden;
  padding: 0;
  position: absolute;
  pointer-events: ${({ isOpen }) => (isOpen ? 'auto' : 'none')};
  transform: ${({ isOpen }) =>
    isOpen ? 'translate3d(0, 0, 0)' : 'translate3d(0, -1rem, 0)'};
  z-index: ${Z_INDEX.POPOVER_MENU};
`;
Menu.propTypes = {
  isOpen: PropTypes.bool,
};

export const MenuItem = styled.li`
  padding: 14px 16px;
  background: ${({ isHovering, theme }) =>
    isHovering ? theme.colors.gray50 : 'none'};
  color: ${({ theme }) => theme.colors.gray700};
  cursor: ${({ isDisabled }) => (isDisabled ? 'default' : 'pointer')};
  display: flex;
  font-family: ${({ theme }) => theme.fonts.popoverMenu.family};
  font-size: ${({ theme }) => theme.fonts.popoverMenu.size};
  line-height: ${({ theme }) => theme.fonts.popoverMenu.lineHeight};
  font-weight: ${({ theme }) => theme.fonts.popoverMenu.weight};
  letter-spacing: ${({ theme }) => theme.fonts.popoverMenu.letterSpacing};
  width: 100%;
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

const Separator = styled.li`
  height: 1px;
  background: ${({ theme }) => theme.colors.gray50};
  width: 100%;
`;

const PopoverMenu = ({
  className,
  isOpen,
  items,
  onSelect,
  framelessButton,
}) => {
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
    <Menu
      className={className}
      isOpen={isOpen}
      framelessButton={framelessButton}
    >
      {items.map((item, index) => {
        if (item.separator) {
          return renderSeparator(index);
        }
        return renderMenuItem(item, index);
      })}
    </Menu>
  );
};

PopoverMenu.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
      label: PropTypes.string,
    })
  ).isRequired,

  className: PropTypes.string,
  isOpen: PropTypes.bool,
  onSelect: PropTypes.func,
  framelessButton: PropTypes.bool,
};

export default PopoverMenu;
