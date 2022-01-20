/*
 * Copyright 2022 Google LLC
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
import {
  useDebouncedCallback,
  useCallback,
  useEffect,
  useRef,
} from '@web-stories-wp/react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { useKeyDownEffect } from '../../keyboard';
import { FOCUSABLE_SELECTORS, KEYS } from '../../../utils';
import { useContextMenu } from '../contextMenuProvider';
import MenuButton from './button';
import Suffix from './suffix';

/**
 * Extracts all focusable children from an html tree, optionally ignoring items from submenu.
 *
 * @param {HTMLElement} parent The parent to search
 * @return {Array.<HTMLElement>} List of focusable elements
 */
function getFocusableChildren(parent) {
  return Array.from(parent.querySelectorAll(FOCUSABLE_SELECTORS.join(', ')));
}

function SubMenuTrigger({
  openSubMenu,
  closeSubMenu,
  isSubMenuOpen,
  isRTL = false,
  subMenuRef,
  parentMenuRef,
  label,
  SuffixIcon,
  ...buttonProps
}) {
  const ref = useRef();
  const pointerTracker = useRef({});

  const { setFocusedId } = useContextMenu(({ actions }) => ({
    setFocusedId: actions.setFocusedId,
  }));

  const pointerIsOutside = (node) => {
    const { x, y, width, height } = node.getBoundingClientRect();
    const { x: pointerX, y: pointerY } = pointerTracker.current;
    const buffer = 2;
    return (
      pointerX < x - buffer ||
      pointerX > x + width + buffer ||
      pointerY < y - buffer ||
      pointerY > y + height + buffer
    );
  };

  const maybeCloseSubMenu = useDebouncedCallback(() => {
    if (!ref.current || !subMenuRef.current?.firstChild) {
      return;
    }
    // If after 200ms the cursor is not in the submenu and not in itself, leave.
    if (
      pointerIsOutside(ref.current) &&
      pointerIsOutside(subMenuRef.current.firstChild)
    ) {
      closeSubMenu();
    }
  }, 200);

  const trackPointer = useCallback((e) => {
    pointerTracker.current.x = e.clientX;
    pointerTracker.current.y = e.clientY;
  }, []);

  useEffect(() => {
    document.addEventListener('pointermove', trackPointer);
    return () => {
      document.removeEventListener('pointermove', trackPointer);
    };
  }, [trackPointer]);

  useEffect(() => {
    if (isSubMenuOpen && subMenuRef.current) {
      const subMenuItems = getFocusableChildren(subMenuRef.current);
      subMenuItems[0].focus();
      setFocusedId(subMenuItems[0].id);
    }
  }, [isSubMenuOpen, subMenuRef, setFocusedId]);

  // If the pointer enters parent menu, maybe we need to close the submenu.
  useEffect(() => {
    const node = parentMenuRef.current?.firstChild;
    if (!isSubMenuOpen || !node) {
      return undefined;
    }
    node.addEventListener('pointerenter', maybeCloseSubMenu);
    return () => {
      node.removeEventListener('pointerenter', maybeCloseSubMenu);
    };
  }, [isSubMenuOpen, parentMenuRef, maybeCloseSubMenu]);

  const handleKeyboardEvents = useCallback(
    (evt) => {
      const { code } = evt;
      if ([KEYS.SPACE, KEYS.ENTER].includes(code)) {
        if (!isSubMenuOpen) {
          openSubMenu();
        } else {
          closeSubMenu();
        }
        return;
      }
      if ((!isRTL && KEYS.RIGHT === code) || (isRTL && KEYS.LEFT) === code) {
        if (!isSubMenuOpen) {
          openSubMenu();
        }
      }
    },
    [openSubMenu, closeSubMenu, isSubMenuOpen, isRTL]
  );

  useKeyDownEffect(
    ref,
    { key: ['enter', 'space', 'left', 'right'] },
    handleKeyboardEvents,
    [handleKeyboardEvents]
  );

  // Menu trigger does not react to clicking.
  return (
    <MenuButton
      {...buttonProps}
      ref={ref}
      onPointerEnter={openSubMenu}
      onPointerLeave={maybeCloseSubMenu}
      onClick={(e) => e.preventDefault()}
    >
      {label}
      {SuffixIcon && (
        <Suffix>
          <SuffixIcon />
        </Suffix>
      )}
    </MenuButton>
  );
}

SubMenuTrigger.propTypes = {
  openSubMenu: PropTypes.func.isRequired,
  closeSubMenu: PropTypes.func.isRequired,
  isSubMenuOpen: PropTypes.bool.isRequired,
  isRTL: PropTypes.bool,
  subMenuRef: PropTypes.object.isRequired,
  parentMenuRef: PropTypes.object.isRequired,
  label: PropTypes.string,
  SuffixIcon: PropTypes.object,
};

export default SubMenuTrigger;
