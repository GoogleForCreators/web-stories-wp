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

const MenuWrapper = styled.div(
  ({ theme }) => css`
    padding: ${({ $isIconMenu }) => ($isIconMenu ? '4px 3px' : '8px 0')};
    background-color: ${theme.colors.bg.primary};
    border-radius: ${theme.borders.radius.small};
    border: 1px solid ${theme.colors.border.disable};
    width: ${({ $isIconMenu }) => ($isIconMenu ? 40 : 210)}px;

    *:last-child {
      margin-bottom: 0;
    }
  `
);
MenuWrapper.propTypes = {
  isIconMenu: PropTypes.bool,
};

/**
 * Extracts all focusable children from an html tree.
 *
 * @param {HTMLElement} parent The parent to search
 * @return {Array.<HTMLElement>} List of focusable elements
 */
function getFocusableChildren(parent) {
  return Array.from(parent.querySelectorAll(FOCUSABLE_SELECTORS.join(', ')));
}

const Menu = ({
  children,
  disableControlledTabNavigation,
  isOpen,
  onFocus = noop,
  ...props
}) => {
  const { focusedId, isIconMenu, onDismiss, setFocusedId } = useContextMenu(
    ({ state, actions }) => ({
      focusedId: state.focusedId,
      isIconMenu: state.isIconMenu,
      onDismiss: actions.onDismiss,
      setFocusedId: actions.setFocusedId,
    })
  );
  const mouseDownOutsideRef = useMouseDownOutsideRef(() => {
    isOpen && onDismiss();
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

      const focusableChildren = getFocusableChildren(menuRef.current);

      const prevIndex = focusableChildren.findIndex(
        (element) => element.id === focusedId
      );

      if (prevIndex === -1 && focusableChildren.length) {
        setFocusedId(focusableChildren[0].id);
        return;
      }

      const isAscending = [KEYS.UP, KEYS.LEFT].includes(key);
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
    },
    [focusedId, onDismiss, setFocusedId]
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
};

Menu.propTypes = MenuPropTypes;

export default Menu;
