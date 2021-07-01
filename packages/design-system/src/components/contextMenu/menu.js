/*
 * Copyright 2021 Google LLC
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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { __ } from '@web-stories-wp/i18n';
/**
 * Internal dependencies
 */
import { BUTTON_TRANSITION_TIMING } from '../button/constants';
import { useKeyDownEffect } from '../keyboard';
import { KEYS } from '../../utils';
import { MenuItem, MenuItemProps } from './menuItem';

const FOCUSABLE_ELEMENTS = ['A', 'BUTTON'];

const SEPARATOR_TOP_CLASS = 'separatorTop';
const SEPARATOR_BOTTOM_CLASS = 'separatorBottom';

const MenuWrapper = styled.div(
  ({ theme }) => css`
    padding: ${({ isIconMenu }) => (isIconMenu ? 0 : '5px 0 0')};
    background-color: ${theme.colors.bg.primary};
    pointer-events: none;
    border-radius: ${theme.borders.radius.small};
    border: 1px solid ${theme.colors.border.disable};
    width: ${({ isIconMenu }) => (isIconMenu ? '40px' : '200px')};
  `
);
MenuWrapper.propTypes = {
  isIconMenu: PropTypes.bool,
};

const separatorCSS = css`
  display: block;
  content: '';
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.divider.primary};
  ${({ isIconMenu, theme }) =>
    isIconMenu &&
    css`
      width: 40%;
      margin: auto;
      background-color: ${theme.colors.divider.primary};
    `}
`;
separatorCSS.propTypes = {
  isIconMenu: PropTypes.bool,
};

const MenuList = styled.ul`
  background-color: ${({ theme }) => theme.colors.bg.primary};
  border-radius: ${({ theme }) => theme.borders.radius.small};
  margin: 0;
  padding: ${({ isIconMenu }) => (isIconMenu ? 0 : '4px 0')};
  pointer-events: auto;
  list-style: none;

  a {
    background-color: transparent;
    text-decoration: none;
  }

  li {
    a,
    button,
    div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 16px;
      border: 0;
      transition: background-color ${BUTTON_TRANSITION_TIMING};
    }
    ${({ isIconMenu }) =>
      isIconMenu &&
      css`
        margin: 0;
        button {
          padding: 0;
          margin: 4px auto;
        }
        div,
        a {
          padding: 0;
        }
      `}

    span {
      transition: color ${BUTTON_TRANSITION_TIMING};
    }

    a {
      :active span,
      :hover span {
        color: ${({ theme }) => theme.colors.fg.primary};
      }
    }

    button {
      width: ${({ isIconMenu }) => (isIconMenu ? '32px' : '100%')};
      border-radius: ${({ isIconMenu }) => (isIconMenu ? '4px' : 0)};
      background-color: transparent;

      :disabled {
        background-color: transparent;

        span {
          color: ${({ theme }) => theme.colors.bg.tertiary};
        }
      }

      :active span,
      :hover span {
        color: ${({ theme }) => theme.colors.fg.primary};
      }
    }

    &.separatorTop {
      &:before {
        ${separatorCSS};
      }
    }

    &.separatorBottom {
      &:after {
        ${separatorCSS};
      }
    }

    :hover a,
    button:hover:not(:disabled) {
      background-color: ${({ theme }) =>
        theme.colors.interactiveBg.secondaryHover};
    }

    :active a,
    button:active:not(:disabled) {
      background-color: ${({ theme }) =>
        theme.colors.interactiveBg.secondaryPress};
    }
  }
`;
MenuList.propTypes = {
  isIconMenu: PropTypes.bool,
};

const Menu = ({
  items,
  isIconMenu,
  isOpen,
  onDismiss,
  groupLabel = __('Menu options', 'web-stories'),
  disableControlledTabNavigation = false,
  ...props
}) => {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const listRef = useRef(null);
  const menuWasAlreadyOpen = useRef(isOpen);
  const ids = useMemo(() => items.map(() => uuidv4()), [items]);

  const totalIndex = useMemo(() => items.length - 1, [items]);

  const handleFocusItem = useCallback((ev, itemIndex, focusCallback) => {
    setFocusedIndex(itemIndex);
    focusCallback?.(ev);
  }, []);

  /**
   * Allow navigation of the list using the UP and DOWN arrow keys.
   *
   * @param {Event} event The synthetic event
   * @return {void} void
   */
  const handleKeyboardNav = useCallback(
    ({ key, shiftKey }) => {
      const isAscending =
        [KEYS.UP, KEYS.LEFT].includes(key) || (key === KEYS.TAB && shiftKey);
      let index = focusedIndex + (isAscending ? -1 : 1);
      let terminate = isAscending ? index < 0 : index > totalIndex;

      while (!terminate) {
        const element = listRef.current?.children?.[index]?.children?.[0];

        if (
          FOCUSABLE_ELEMENTS.includes(element?.tagName) &&
          !element?.disabled
        ) {
          element?.focus();
          setFocusedIndex(index);
          return;
        }

        index = isAscending ? index - 1 : index + 1;
        terminate = isAscending ? index < 0 : index > totalIndex;
      }

      // If we didn't find a focusable element or get to the start/end
      // of the list then **tabbing should close the menu**
      if (key === KEYS.TAB) {
        onDismiss?.();
      }
    },
    [focusedIndex, onDismiss, totalIndex]
  );

  useEffect(() => {
    // focus first 'focusable' element if menu is opened and no element is focused.
    // close the menu if there's no focusable element
    if (isOpen && !menuWasAlreadyOpen.current && listRef?.current) {
      let index = 0;

      while (index <= totalIndex) {
        const element = listRef.current?.children?.[index]?.children?.[0];

        if (
          FOCUSABLE_ELEMENTS.includes(element?.tagName) &&
          !element?.disabled
        ) {
          element?.focus();
          setFocusedIndex(index);
          menuWasAlreadyOpen.current = true;
          return;
        }

        index++;
      }

      menuWasAlreadyOpen.current = true;
    }
  }, [focusedIndex, isOpen, totalIndex]);

  useEffect(() => {
    // reset state when menu is closed. This component does not unmount so
    // we need to reset the state manually
    if (!isOpen) {
      setFocusedIndex(-1);
      menuWasAlreadyOpen.current = false;
    }
  }, [isOpen]);

  const keySpec = useMemo(
    () =>
      disableControlledTabNavigation
        ? { key: ['down', 'up', 'left', 'right'] }
        : { key: ['down', 'up', 'left', 'right', 'tab'], shift: true },
    [disableControlledTabNavigation]
  );

  useKeyDownEffect(listRef, keySpec, handleKeyboardNav, [
    handleKeyboardNav,
    keySpec,
  ]);

  return (
    <MenuWrapper isIconMenu={isIconMenu} role="menu">
      <MenuList
        data-testid="context-menu-list"
        ref={listRef}
        isIconMenu={isIconMenu}
        aria-label={groupLabel}
        role="group"
        {...props}
      >
        {items.map(({ separator, onFocus, ...itemProps }, index) => (
          <li
            key={ids[index]}
            role="menuitem"
            className={
              (separator === 'top' && SEPARATOR_TOP_CLASS) ||
              (separator === 'bottom' && SEPARATOR_BOTTOM_CLASS) ||
              ''
            }
          >
            <MenuItem
              index={index}
              onFocus={(ev) => handleFocusItem(ev, index, onFocus)}
              onDismiss={onDismiss}
              {...itemProps}
            />
          </li>
        ))}
      </MenuList>
    </MenuWrapper>
  );
};

export const MenuPropTypes = {
  groupLabel: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      ...MenuItemProps,
      separator: PropTypes.oneOf(['bottom', 'top']),
    }).isRequired
  ),
  isIconMenu: PropTypes.bool,
  isOpen: PropTypes.bool,
  onDismiss: PropTypes.func,
  disableControlledTabNavigation: PropTypes.bool,
};

Menu.propTypes = MenuPropTypes;

export default Menu;
