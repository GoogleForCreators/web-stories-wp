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
import { useCallback, useEffect, useMemo, useRef } from 'react';
import styled, { css } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
/**
 * Internal dependencies
 */
import { BUTTON_TRANSITION_TIMING } from '../button/constants';
import { useKeyDownEffect } from '../keyboard';
import { KEYS } from '../../utils/constants';
import { MenuItem, MenuItemProps } from './menuItem';

const FOCUSABLE_ELEMENTS = ['A', 'BUTTON'];

const SEPARATOR_TOP_CLASS = 'separatorTop';
const SEPARATOR_BOTTOM_CLASS = 'separatorBottom';

const MenuWrapper = styled.div(
  ({ theme }) => css`
    padding: 5px 0 0;
    background-color: ${theme.colors.bg.primary};
    pointer-events: none;
    border-radius: ${theme.borders.radius.small};
    border: 1px solid ${theme.colors.border.disable};
    width: 200px;
  `
);

const MenuList = styled.ul(
  ({ theme }) => css`
    background-color: ${theme.colors.bg.primary};
    border-radius: ${theme.borders.radius.small};
    margin: 0;
    padding: 4px 0;
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

      span {
        transition: color ${BUTTON_TRANSITION_TIMING};
      }

      a {
        :active span,
        :hover span {
          color: ${theme.colors.fg.primary};
        }
      }

      button {
        width: 100%;
        border-radius: 0;
        background-color: transparent;

        :disabled {
          background-color: transparent;

          span {
            color: ${theme.colors.bg.tertiary};
          }
        }

        :active span,
        :hover span {
          color: ${theme.colors.fg.primary};
        }
      }

      &.separatorTop {
        border-top: 1px solid ${theme.colors.bg.tertiary};
      }

      &.separatorBottom {
        border-bottom: 1px solid ${theme.colors.bg.tertiary};
      }

      :hover a,
      button:hover:not(:disabled) {
        background-color: ${theme.colors.interactiveBg.secondaryHover};
      }

      :active a,
      button:active:not(:disabled) {
        background-color: ${theme.colors.interactiveBg.secondaryPress};
      }
    }
  `
);

const Menu = ({ items, isOpen, ...props }) => {
  const focusedIndex = useRef(-1);
  const listRef = useRef(null);
  const menuWasAlreadyOpen = useRef(isOpen);
  const ids = useMemo(() => items.map(() => uuidv4()), [items]);

  const totalIndex = useMemo(() => items.length - 1, [items]);

  /**
   * Allow navigation of the list using the UP and DOWN arrow keys.
   *
   * @param {Event} event The synthetic event
   * @return {void} void
   */
  const handleKeyboardNav = useCallback(
    ({ key }) => {
      const isAscending = key === KEYS.UP;
      let index = focusedIndex.current + (isAscending ? -1 : 1);
      let terminate = isAscending ? index < 0 : index > totalIndex;

      while (!terminate) {
        const element = listRef.current?.children?.[index]?.children?.[0];

        if (
          FOCUSABLE_ELEMENTS.includes(element?.tagName) &&
          !element?.disabled
        ) {
          focusedIndex.current = index;
          element.focus();
          return;
        }

        index = isAscending ? index - 1 : index + 1;
        terminate = isAscending ? index < 0 : index > totalIndex;
      }
    },
    [totalIndex]
  );

  useEffect(() => {
    // focus first 'focusable' element if menu is opened and no element is focused
    if (
      isOpen &&
      !menuWasAlreadyOpen.current &&
      listRef?.current &&
      focusedIndex.current === -1
    ) {
      let index = 0;

      while (index <= totalIndex) {
        const element = listRef.current?.children?.[index]?.children?.[0];

        if (
          FOCUSABLE_ELEMENTS.includes(element?.tagName) &&
          !element?.disabled
        ) {
          focusedIndex.current = index;
          element.focus();
          return;
        }

        index++;
      }

      menuWasAlreadyOpen.current = true;
    }
  }, [isOpen, totalIndex]);

  useEffect(() => {
    // reset state when menu is closed. This component does not unmount so
    // we need to reset the state manually
    if (!isOpen) {
      focusedIndex.current = -1;
      menuWasAlreadyOpen.current = false;
    }
  }, [isOpen]);

  useKeyDownEffect(listRef, { key: ['down', 'up'] }, handleKeyboardNav, [
    handleKeyboardNav,
  ]);

  return (
    <MenuWrapper>
      <MenuList ref={listRef} {...props}>
        {items.map(({ separator, ...itemProps }, index) => (
          <li
            key={ids[index]}
            className={
              (separator === 'top' && SEPARATOR_TOP_CLASS) ||
              (separator === 'bottom' && SEPARATOR_BOTTOM_CLASS) ||
              ''
            }
          >
            <MenuItem {...itemProps} />
          </li>
        ))}
      </MenuList>
    </MenuWrapper>
  );
};

export const MenuPropTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      ...MenuItemProps,
      separator: PropTypes.oneOf(['bottom', 'top']),
    }).isRequired
  ),
  isOpen: PropTypes.bool,
};

Menu.propTypes = MenuPropTypes;

export default Menu;
