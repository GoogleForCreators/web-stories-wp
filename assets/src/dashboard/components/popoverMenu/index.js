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
import styled, { css } from 'styled-components';
import { useCallback, useEffect, useState, useRef } from 'react';

/**
 * Internal dependencies
 */
import { CORNER_DIRECTIONS, KEYS, Z_INDEX } from '../../constants';
import { DROPDOWN_ITEM_PROP_TYPE } from '../types';

export const Menu = styled.ul`
  align-items: flex-start;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  margin: ${({ framelessButton }) => (framelessButton ? '0' : '20px 0')};
  min-width: 210px;
  overflow: hidden;
  padding: 0;
  position: absolute;
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

const PopoverMenuWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  pointer-events: ${({ isOpen }) => (isOpen ? 'auto' : 'none')};
  z-index: ${Z_INDEX.POPOVER_MENU};
  transform: ${(props) => {
    switch (props.align) {
      case CORNER_DIRECTIONS.TOP_LEFT:
        return 'translate(-100%, -100%)';
      case CORNER_DIRECTIONS.TOP_RIGHT:
        return 'transformranslate(100%, -100%)';
      case CORNER_DIRECTIONS.BOTTOM_RIGHT:
        return 'translate(100%, 20%)';
      case CORNER_DIRECTIONS.BOTTOM_LEFT:
      default:
        return 'translate(-100%, 20%)';
    }
  }};

  ${Menu} {
    ${(props) => {
      switch (props.align) {
        case CORNER_DIRECTIONS.TOP_RIGHT:
          return css`
            top: 0;
            right: 0;
            transform: translate(0%, 0%);
          `;
        case CORNER_DIRECTIONS.TOP_LEFT:
          return css`
            top: 0;
            left: 0;
            transform: translate(0%, 0%);
          `;
        case CORNER_DIRECTIONS.BOTTOM_RIGHT:
          return css`
            right: 0;
            bottom: 0;
            transform: translate(0%, 0%);
          `;
        case CORNER_DIRECTIONS.BOTTOM_LEFT:
        default:
          return css`
            left: 0;
            bottom: 0;
            transform: translate(0%, 0%);
          `;
      }
    }}
  }
`;
PopoverMenuWrapper.propTypes = {
  align: PropTypes.oneOf(Object.values(CORNER_DIRECTIONS)),
  isOpen: PropTypes.bool,
};

const PopoverMenu = ({
  className,
  isOpen,
  items,
  onSelect,
  framelessButton,
}) => {
  const [align, setAlign] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const listRef = useRef(null);
  const menuRef = useRef(null);
  const menuTogglePositionRef = useRef(null);

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

  useEffect(() => {
    if (!isOpen) {
      setAlign(null);
      return;
    }
    if (!(menuTogglePositionRef.current && menuRef.current)) return;

    const toggleBoundingBox = menuTogglePositionRef.current.getBoundingClientRect();
    const menuBoundingBox = menuRef.current.getBoundingClientRect();

    const alignHorizontal =
      toggleBoundingBox.left + menuBoundingBox.width > window.innerWidth
        ? 'RIGHT'
        : 'LEFT';
    const alignVertical =
      0 > toggleBoundingBox.bottom - menuBoundingBox.height ? 'TOP' : 'BOTTOM';

    setAlign(CORNER_DIRECTIONS[`${alignVertical}_${alignHorizontal}`]);
  }, [isOpen]);

  const isOpenAndAlignmentSet = isOpen && Boolean(align);

  return (
    <PopoverMenuWrapper
      ref={menuTogglePositionRef}
      isOpen={isOpenAndAlignmentSet}
      align={align}
    >
      <Menu
        ref={menuRef}
        className={className}
        framelessButton={framelessButton}
      >
        {items.map((item, index) => {
          if (item.separator) {
            return renderSeparator(index);
          }
          return renderMenuItem(item, index);
        })}
      </Menu>
    </PopoverMenuWrapper>
  );
};

PopoverMenu.propTypes = {
  items: PropTypes.arrayOf(DROPDOWN_ITEM_PROP_TYPE).isRequired,
  className: PropTypes.string,
  isOpen: PropTypes.bool,
  onSelect: PropTypes.func,
  framelessButton: PropTypes.bool,
};

export default PopoverMenu;
