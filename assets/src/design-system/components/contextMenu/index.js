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
import { useCallback, useMemo, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
/**
 * Internal dependencies
 */
import { BUTTON_TRANSITION_TIMING } from '../button/constants';
import { MenuItem, MenuItemProps } from './menu-item';

const DOWN = 'ArrowDown';
const UP = 'ArrowUp';

const SEPARATOR_TOP_CLASS = 'separatorTop';
const SEPARATOR_BOTTOM_CLASS = 'separatorBottom';

const Popover = styled.div(
  ({ isOpen, theme }) => css`
    position: absolute;
    display: none;
    margin: 5px 0 0;
    background-color: ${theme.colors.bg.primary};
    pointer-events: none;
    border-radius: ${theme.borders.radius.small};
    border: 1px solid ${theme.colors.border.disable};
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    width: 200px;

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
    border-radius: ${theme.borders.radius.small};
    margin: 0;
    /* min-width: 200px; */
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

const ContextMenu = ({ isOpen, items, ...props }) => {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const listRef = useRef(null);
  const ids = useMemo(() => items.map(() => uuidv4()), [items]);

  /**
   * Allow navigation of the list using the UP and DOWN arrow keys.
   *
   * @param {Event} ev The synthetic event
   * @return {void} void
   */
  const handleKeyDown = useCallback(
    (ev) => {
      switch (ev.key) {
        case DOWN:
          ev.preventDefault();
          if (listRef.current && focusedIndex < items.length - 1) {
            let index = focusedIndex + 1;
            while (index < items.length) {
              const element = listRef.current.children[index].children[0];
              if (
                ['A', 'BUTTON'].includes(element.tagName) &&
                !element.disabled
              ) {
                setFocusedIndex(index);
                return;
              }
              index++;
            }
          }
          break;
        case UP:
          ev.preventDefault();
          if (listRef.current && focusedIndex > -1) {
            let index = focusedIndex - 1;
            while (index > -1) {
              const element = listRef.current.children[index].children[0];
              if (
                ['A', 'BUTTON'].includes(element.tagName) &&
                !element.disabled
              ) {
                setFocusedIndex(index);
                return;
              }
              index--;
            }
          }
          break;
        default:
          break;
      }
    },
    [focusedIndex, items.length]
  );

  return (
    <Popover role="dialog" isOpen={isOpen} {...props}>
      <MenuContainer ref={listRef} onKeyDown={handleKeyDown}>
        {items.map(({ separator, ...itemProps }, index) => (
          <li
            id={ids[index]}
            key={ids[index]}
            className={
              (separator === 'top' && SEPARATOR_TOP_CLASS) ||
              (separator === 'bottom' && SEPARATOR_BOTTOM_CLASS) ||
              ''
            }
          >
            <MenuItem
              setFocusedIndex={setFocusedIndex}
              focusedIndex={focusedIndex}
              index={index}
              {...itemProps}
            />
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
