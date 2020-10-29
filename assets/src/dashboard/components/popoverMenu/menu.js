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
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { rgba } from 'polished';
import {
  KEYS,
  STORY_CONTEXT_MENU_ACTIONS,
  KEYBOARD_USER_SELECTOR,
} from '../../constants';
import { DROPDOWN_ITEM_PROP_TYPE } from '../types';
import { TypographyPresets } from '../typography';

const CLOSE_MENU_ACTION = { value: STORY_CONTEXT_MENU_ACTIONS.CLOSE };

export const MenuContainer = styled.ul`
  align-items: flex-start;
  background-color: ${({ theme }) => theme.internalTheme.colors.white};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  margin: 0;
  min-width: 210px;
  overflow: hidden;
  padding: 5px 0;
  pointer-events: auto;

  & > a {
    background-color: none;
    text-decoration: none;
    &:focus {
      box-shadow: none; /*override common js */
    }
  }
`;

MenuContainer.propTypes = {
  isOpen: PropTypes.bool,
};

export const MenuItem = styled.li`
  ${TypographyPresets.Small};
  ${({ theme, isDisabled, isHovering }) => `
    margin-bottom: 0; /* override common js */
    padding: 5px 25px;
    background: ${
      isHovering && !isDisabled ? theme.internalTheme.colors.gray25 : 'none'
    };
    color: ${
      isDisabled
        ? theme.internalTheme.colors.gray400
        : theme.internalTheme.colors.gray700
    };
    cursor: ${isDisabled ? 'default' : 'pointer'};
    border: ${theme.internalTheme.borders.transparent};
    border-width: 2px;
    display: flex;
    width: 100%;

    &.separatorTop {
      border-top: 1px solid ${theme.internalTheme.colors.gray50};
    }

    &.separatorBottom {
      border-bottom: 1px solid ${theme.internalTheme.colors.gray50};
    }

    &:focus, &:active, &:hover {
      outline: none;
      color: ${
        isDisabled
          ? theme.internalTheme.colors.gray400
          : theme.internalTheme.colors.gray700
      };
    }

    ${KEYBOARD_USER_SELECTOR} &:focus {
      border: 2px solid ${rgba(theme.internalTheme.colors.bluePrimary, 0.85)};
    }

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

const Menu = ({ isOpen, currentValueIndex = 0, items, onSelect, ...rest }) => {
  const [hoveredIndex, setHoveredIndex] = useState(currentValueIndex);
  const [focusedIndex, setFocusedIndex] = useState(currentValueIndex);
  const listRef = useRef(null);
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (event) => {
        event.stopPropagation();
        switch (event.key) {
          case KEYS.UP:
            event.preventDefault();
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
            // let anchor items be handled natively by browser
            if (!items[focusedIndex].url) {
              event.preventDefault();
              const itemIsDisabled =
                !items[focusedIndex].value && items[focusedIndex].value !== 0;
              if (onSelect && !itemIsDisabled) {
                onSelect(items[focusedIndex]);
              }
            }
            break;

          case KEYS.ESC:
            event.preventDefault();
            if (onSelect) {
              // Close menu
              onSelect(CLOSE_MENU_ACTION);
            }
            break;

          default:
            break;
        }
      };
      const listRefEl = listRef.current;
      listRefEl.addEventListener('keydown', handleKeyDown);
      return () => listRefEl.removeEventListener('keydown', handleKeyDown);
    }
  }, [focusedIndex, items, onSelect, isOpen]);

  useEffect(() => {
    if (listRef.current && isOpen) {
      listRef.current?.children[currentValueIndex]?.focus();
    }
    setHoveredIndex(currentValueIndex);
  }, [currentValueIndex, isOpen]);

  const renderMenuItem = useCallback(
    (item, index) => {
      const itemIsDisabled = !item.value && item.value !== 0;
      const menuItemPropsAsLink = item.url
        ? {
            href: item.url,
            as: 'a',
            ...(item.newTab
              ? {
                  target: '_blank',
                  rel: 'noreferrer',
                }
              : {}),
          }
        : {};

      return (
        <MenuItem
          tabIndex={0}
          key={`${item.value}_${index}`}
          isHovering={index === hoveredIndex}
          onClick={() => !itemIsDisabled && onSelect && onSelect(item)}
          onMouseEnter={() => setHoveredIndex(index)}
          onFocus={() => setFocusedIndex(index)}
          isDisabled={itemIsDisabled}
          aria-label={
            // allow users to know what is in menu while still telling them items are disabled
            itemIsDisabled
              ? sprintf(
                  /* translators: %s: item label.*/
                  __('%s (currently unavailable)', 'web-stories'),
                  item.label
                )
              : item.label
          }
          className={
            (item.separator === 'top' && 'separatorTop') ||
            (item.separator === 'bottom' && 'separatorBottom')
          }
          {...menuItemPropsAsLink}
        >
          <MenuItemContent>{item.label}</MenuItemContent>
        </MenuItem>
      );
    },
    [hoveredIndex, onSelect]
  );

  return (
    <MenuContainer
      tabIndex={0}
      ref={listRef}
      onKeyDown={(e) => e.stopPropagation()}
      {...rest}
    >
      {items.map((item, index) => renderMenuItem(item, index))}
    </MenuContainer>
  );
};

export const MenuProps = {
  items: PropTypes.arrayOf(DROPDOWN_ITEM_PROP_TYPE).isRequired,
  currentValueIndex: PropTypes.number,
  isOpen: PropTypes.bool,
  onSelect: PropTypes.func,
};

Menu.propTypes = MenuProps;

export default Menu;
