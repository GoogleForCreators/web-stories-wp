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
import { useMemo } from 'react';
import styled, { css } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
/**
 * Internal dependencies
 */
import { BUTTON_TRANSITION_TIMING } from '../button/constants';
import { MenuItem, MenuItemProps } from './menu-item';

const Popover = styled.div(
  ({ isOpen, theme }) => css`
    position: absolute;
    display: none;
    margin: 5px 0 0;
    background-color: transparent;
    pointer-events: none;
    border-radius: ${theme.borders.radius.small};
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

    ${isOpen &&
    css`
      display: block;
      z-index: 10;
      opacity: 1;
      pointer-events: auto;
    `};
  `
);

const MenuContainer = styled.ul(
  ({ theme }) => css`
    background-color: ${theme.colors.bg.primary};
    border-radius: 8px;
    margin: 0;
    min-width: 210px;
    padding: 5px 0;
    pointer-events: auto;
    list-style: none;

    a {
      background-color: none;
      text-decoration: none;
    }

    li {
      a,
      button,
      div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 18px;
        border: 0;
        transition: background-color ${BUTTON_TRANSITION_TIMING};
      }

      button,
      button:disabled {
        width: 100%;
        border-radius: 0;
        background-color: transparent;
      }

      button:disabled * {
        color: ${theme.colors.bg.tertiary};
      }

      &.separatorTop {
        border-top: 1px solid ${theme.colors.bg.tertiary};
      }

      &.separatorBottom {
        border-bottom: 1px solid ${theme.colors.bg.tertiary};
      }

      :hover a,
      button:active,
      :hover button:not(:disabled) {
        background-color: ${theme.colors.bg.secondary};
      }
    }
  `
);

const ContextMenu = ({ isOpen, items, ...props }) => {
  const ids = useMemo(() => items.map(() => uuidv4()), [items]);

  return (
    <Popover isOpen={isOpen} {...props}>
      <MenuContainer>
        {items.map(({ separator, ...itemProps }, index) => (
          <li
            key={ids[index]}
            className={
              (separator === 'top' && 'separatorTop') ||
              (separator === 'bottom' && 'separatorBottom') ||
              ''
            }
          >
            <MenuItem {...itemProps} />
          </li>
        ))}
      </MenuContainer>
    </Popover>
  );
};

ContextMenu.propTypes = {
  isOpen: PropTypes.bool,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      ...MenuItemProps,
      separator: PropTypes.oneOf(['bottom', 'top']),
    }).isRequired
  ),
};

export default ContextMenu;
