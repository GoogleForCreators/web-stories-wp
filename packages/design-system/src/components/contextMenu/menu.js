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
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useCombinedRefs,
} from '@googleforcreators/react';
import styled, { css } from 'styled-components';
/**
 * Internal dependencies
 */
import {
  FOCUSABLE_SELECTORS,
  KEYS,
  noop,
  useMouseDownOutsideRef,
} from '../../utils';
import { useKeyDownEffect } from '../keyboard';
import { useContextMenu } from './contextMenuProvider';

export const CONTEXT_MENU_WIDTH = 218;

const MenuWrapper = styled.div(
  ({ theme }) => css`
    padding: ${({ $isIconMenu }) => ($isIconMenu ? '4px 3px' : '8px 0')};
    background-color: ${theme.colors.bg.primary};
    border-radius: ${theme.borders.radius.small};
    border: 1px solid ${theme.colors.border.disable};
    width: ${({ $isIconMenu }) => ($isIconMenu ? 40 : CONTEXT_MENU_WIDTH)}px;

    *:last-child {
      margin-bottom: 0;
    }
  `
);
MenuWrapper.propTypes = {
  isIconMenu: PropTypes.bool,
};

/**
 * Extracts all focusable children from an html tree, optionally ignoring items from submenu.
 *
 * @param {HTMLElement} parent The parent to search
 * @param {boolean} isSubMenu If we're searching from submenu.
 * @return {Array.<HTMLElement>} List of focusable elements
 */
function getFocusableChildren(parent, isSubMenu) {
  const allButtons = Array.from(
    parent.querySelectorAll(FOCUSABLE_SELECTORS.join(', '))
  );
  if (isSubMenu) {
    return allButtons;
  }
  // Skip considering the submenu, and the submenu items.
  return allButtons.filter(
    (elem) => !elem.matches('[role="menu"], [role="menu"] [role="menu"] *')
  );
}

const Menu = ({
  children,
  disableControlledTabNavigation,
  isOpen,
  onFocus = noop,
  isSubMenu = false,
  parentMenuRef,
  onCloseSubMenu = noop,
  ...props
}) => {
  const { isRTL } = props;
  const { focusedId, isIconMenu, onDismiss, setFocusedId } = useContextMenu(
    ({ state, actions }) => ({
      focusedId: state.focusedId,
      isIconMenu: state.isIconMenu,
      onDismiss: actions.onDismiss,
      setFocusedId: actions.setFocusedId,
    })
  );
  const mouseDownOutsideRef = useMouseDownOutsideRef(() => {
    isOpen && !isSubMenu && onDismiss();
  });
  const menuRef = useRef(null);
  const composedListRef = useCombinedRefs(mouseDownOutsideRef, menuRef);

  const handleFocus = useCallback(
    (evt) => {
      onFocus(evt);

      const focusableChildren = getFocusableChildren(menuRef.current);

      if (menuRef.current === evt.target) {
        focusableChildren?.[0]?.focus();
      }
    },
    [onFocus]
  );

  /**
   * Allow navigation of the list using the UP and DOWN arrow keys.
   * Allow navigation between the parent menu and submenu with LEFT and RIGHT arrow keys.
   * Close menu if ESCAPE is pressed.
   *
   * @param {Event} event The synthetic event
   * @return {void} void
   */
  const handleKeyboardNav = useCallback(
    (evt) => {
      const { key } = evt;
      if (key === 'Escape') {
        onDismiss(evt);
        return;
      }

      const focusableChildren = getFocusableChildren(
        menuRef.current,
        isSubMenu
      );

      let prevIndex = focusableChildren.findIndex(
        (element) => element.id === focusedId
      );

      if (prevIndex === -1 && focusableChildren.length) {
        setFocusedId(focusableChildren[0].id);
        prevIndex = 0;
      }

      // If we're moving up-down.
      if ([KEYS.UP, KEYS.DOWN].includes(key)) {
        const isAscending = KEYS.UP === key;
        let newIndex = prevIndex + (isAscending ? -1 : 1);

        if (newIndex === -1) {
          newIndex = focusableChildren.length - 1;
        }

        // Otherwise move to the next element or loop around the list.
        const newSelectedElement =
          focusableChildren[newIndex % focusableChildren.length];

        newSelectedElement?.focus();
        setFocusedId(newSelectedElement?.id || -1);
        return;
      }
      // Maybe move from submenu to parent menu.
      if (
        isSubMenu &&
        ((!isRTL && KEYS.LEFT === key) || (isRTL && KEYS.RIGHT === key))
      ) {
        // Get the button with expanded popup.
        const parentButton = parentMenuRef.current.querySelector(
          'button[aria-expanded="true"]'
        );
        parentButton?.focus();
        onCloseSubMenu();
      }
    },
    [
      focusedId,
      onDismiss,
      setFocusedId,
      isRTL,
      isSubMenu,
      onCloseSubMenu,
      parentMenuRef,
    ]
  );

  // focus first focusable element on open
  useEffect(() => {
    if (isOpen) {
      const focusableChildren = getFocusableChildren(menuRef.current);

      if (focusableChildren.length) {
        focusableChildren?.[0]?.focus();
        setFocusedId(focusableChildren?.[0]?.id);
      }
    }
  }, [isOpen, setFocusedId]);

  const keySpec = useMemo(
    () =>
      disableControlledTabNavigation
        ? { key: [] }
        : { key: ['tab'], shift: true },
    [disableControlledTabNavigation]
  );

  useKeyDownEffect(
    menuRef,
    { key: ['esc', 'down', 'up', 'left', 'right'] },
    handleKeyboardNav,
    [handleKeyboardNav]
  );

  useKeyDownEffect(menuRef, keySpec, onDismiss, [keySpec, onDismiss]);

  return (
    <MenuWrapper
      ref={composedListRef}
      data-testid="context-menu-list"
      role="menu"
      $isIconMenu={isIconMenu}
      // Tabbing out from the list while using 'shift' would
      // focus the list element. Should just travel back to the previous
      // focusable element in the DOM
      tabIndex={menuRef.current?.contains(document.activeElement) ? -1 : 0}
      onFocus={handleFocus}
      {...props}
    >
      {children}
    </MenuWrapper>
  );
};

export const MenuPropTypes = {
  children: PropTypes.node,
  onFocus: PropTypes.func,
  disableControlledTabNavigation: PropTypes.bool,
  isOpen: PropTypes.bool,
  onCloseSubMenu: PropTypes.func,
  isSubMenu: PropTypes.bool,
  isRTL: PropTypes.bool,
  parentMenuRef: PropTypes.object,
};

Menu.propTypes = MenuPropTypes;

export default Menu;
