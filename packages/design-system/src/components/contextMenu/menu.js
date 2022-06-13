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
  forwardRef,
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
import { CONTEXT_MENU_SKIP_ELEMENT } from './constants';

export const CONTEXT_MENU_MIN_WIDTH = 200;
const CONTEXT_MENU_MAX_WIDTH = 300;

const MenuWrapper = styled.div(
  ({ theme }) => css`
    background-color: ${({ isSecondary }) =>
      isSecondary ? theme.colors.bg.secondary : theme.colors.bg.primary};
    border-radius: ${({ isHorizontal }) =>
      isHorizontal ? theme.borders.radius.medium : theme.borders.radius.small};
    border: 1px solid ${theme.colors.border.disable};
    gap: 6px;
    display: flex;

    ${({ isHorizontal, isIconMenu }) =>
      isHorizontal
        ? css`
            // horizontal menu
            height: 52px;
            padding: 7px 10px;
            align-items: center;
          `
        : css`
            // vertical menu
            flex-direction: column;
            width: ${isIconMenu ? '40px' : 'auto'};
            padding: ${isIconMenu ? '4px 3px' : '8px 0'};
            max-width: ${CONTEXT_MENU_MAX_WIDTH}px;

            ${!isIconMenu &&
            css`
              min-width: ${CONTEXT_MENU_MIN_WIDTH}px;
            `};
          `}

    *:last-child {
      margin-bottom: 0;
    }
  `
);
MenuWrapper.propTypes = {
  isIconMenu: PropTypes.bool,
  isHorizontal: PropTypes.bool,
  isSecondary: PropTypes.bool,
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
  // Skip considering the submenu, and the submenu items as well as inputs that are focus traps (floating menu/toolbar)
  return allButtons.filter((elem) => {
    return !elem.matches(
      `[role="menu"], [role="menu"] [role="menu"] *, .${CONTEXT_MENU_SKIP_ELEMENT}`
    );
  });
}

const Menu = forwardRef(
  (
    {
      children,
      disableControlledTabNavigation,
      isOpen,
      onFocus = noop,
      isSubMenu = false,
      isSecondary = false,
      parentMenuRef,
      onCloseSubMenu = noop,
      dismissOnEscape = true,
      ...props
    },
    ref
  ) => {
    const { isRTL } = props;
    const { focusedId, isIconMenu, isHorizontal, onDismiss, setFocusedId } =
      useContextMenu(({ state, actions }) => ({
        focusedId: state.focusedId,
        isIconMenu: state.isIconMenu,
        isHorizontal: state.isHorizontal,
        onDismiss: actions.onDismiss,
        setFocusedId: actions.setFocusedId,
      }));
    const mouseDownOutsideRef = useMouseDownOutsideRef(() => {
      isOpen && !isSubMenu && onDismiss();
    });
    const menuRef = useRef(null);
    const composedListRef = useCombinedRefs(mouseDownOutsideRef, menuRef, ref);
    /**
     * Focus the first element when the user focuses the wrapper
     * with their keyboard.
     *
     * Clicking in the wrapper should not automatically focus the first
     * focusable element.
     */
    const handleFocus = useCallback(
      (evt) => {
        onFocus(evt);
        const menuChildren = menuRef.current.children || [];
        const isFocusOutsideMenu =
          menuChildren.length &&
          ![...menuChildren].some((child) => child.contains(evt.target));

        if (menuRef.current === evt.target && isFocusOutsideMenu) {
          const focusableChildren = getFocusableChildren(menuRef.current);
          // used to shift focus outline correctly
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'tab' }));
          focusableChildren?.[0]?.focus();
        }
      },
      [onFocus]
    );

    const getPrevIndex = useCallback(
      (focusableChildren) => {
        let prevIndex = focusableChildren.findIndex(
          (element) => element.id === focusedId
        );
        // There are cases where the active element is in the present menu but the focusedId has been reset because of a popup interaction, in those cases we should double check the true focused id by looking at the active element id and comparing.
        if (prevIndex === -1) {
          prevIndex = focusableChildren.findIndex(
            (element) => element.id === document.activeElement.id
          );
        }
        return prevIndex;
      },
      [focusedId]
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

        let prevIndex = getPrevIndex(focusableChildren);

        if (prevIndex === -1 && focusableChildren.length) {
          setFocusedId(focusableChildren[0].id);
          prevIndex = 0;
        }

        const keyBackward = isHorizontal ? KEYS.LEFT : KEYS.UP;
        const keyForward = isHorizontal ? KEYS.RIGHT : KEYS.DOWN;

        // If we're moving through this menu (up/down in vertical, left/right in horizontal).
        if ([keyBackward, keyForward].includes(key)) {
          const isAscending = keyBackward === key;
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

        // The direction to move out of a submenu depends on horizontal/vertical and RTL/LTR
        const keyOut = isHorizontal ? KEYS.UP : isRTL ? KEYS.RIGHT : KEYS.LEFT;

        // Maybe move from submenu to parent menu.
        if (isSubMenu && keyOut === key) {
          // Get the button with expanded popup.
          const parentButton = parentMenuRef.current.querySelector(
            'button[aria-expanded="true"]'
          );
          parentButton?.focus();
          onCloseSubMenu();
        }
      },
      [
        isSubMenu,
        getPrevIndex,
        isHorizontal,
        isRTL,
        onDismiss,
        setFocusedId,
        parentMenuRef,
        onCloseSubMenu,
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
      {
        key: dismissOnEscape
          ? ['esc', 'down', 'up', 'left', 'right']
          : ['down', 'up', 'left', 'right'],
      },
      handleKeyboardNav,
      [handleKeyboardNav, dismissOnEscape]
    );

    useKeyDownEffect(menuRef, keySpec, onDismiss, [keySpec, onDismiss]);

    return (
      <MenuWrapper
        ref={composedListRef}
        data-testid="context-menu-list"
        role="menu"
        isIconMenu={isIconMenu}
        isHorizontal={isHorizontal}
        isSecondary={isSecondary}
        // Tabbing out from the list while using 'shift' would
        // focus the list element. Should just travel back to the previous
        // focusable element in the DOM
        tabIndex={
          menuRef.current?.contains(globalThis?.document?.activeElement)
            ? -1
            : 0
        }
        onFocus={handleFocus}
        {...props}
      >
        {children}
      </MenuWrapper>
    );
  }
);

export const MenuPropTypes = {
  children: PropTypes.node,
  onFocus: PropTypes.func,
  disableControlledTabNavigation: PropTypes.bool,
  isOpen: PropTypes.bool,
  onCloseSubMenu: PropTypes.func,
  isSubMenu: PropTypes.bool,
  isSecondary: PropTypes.bool,
  isRTL: PropTypes.bool,
  parentMenuRef: PropTypes.object,
  dismissOnEscape: PropTypes.bool,
};

Menu.propTypes = MenuPropTypes;

export default Menu;
