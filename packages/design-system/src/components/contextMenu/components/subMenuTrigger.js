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
} from '@googleforcreators/react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { useKeyDownEffect } from '../../keyboard';
import { FOCUSABLE_SELECTORS, KEYS } from '../../../utils';
import { useContextMenu } from '../contextMenuProvider';
import MenuItem from './item';

/**
 * Extracts all focusable children from an html tree.
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
    if (pointerX === undefined || pointerY === undefined) {
      return true;
    }
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

  useEffect(() => {
    if (isSubMenuOpen && subMenuRef.current) {
      const subMenuItems = getFocusableChildren(subMenuRef.current);
      subMenuItems[0].focus();
      setFocusedId(subMenuItems[0].id);
    }
  }, [isSubMenuOpen, subMenuRef, setFocusedId]);

  useEffect(() => {
    const node = parentMenuRef.current?.querySelector('[role="dialog"]');
    if (!isSubMenuOpen || !node) {
      return undefined;
    }
    const onPointerMove = (e) => {
      // Track the pointer when moving inside the menu while the submenu is open.
      pointerTracker.current.x = e.clientX;
      pointerTracker.current.y = e.clientY;
      maybeCloseSubMenu();
    };
    node.addEventListener('pointermove', onPointerMove);
    return () => {
      node.removeEventListener('pointermove', onPointerMove);
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
    <MenuItem
      {...buttonProps}
      ref={ref}
      onPointerEnter={openSubMenu}
      onPointerLeave={() => {
        // Reset tracker in case we moved out of the menu fully.
        pointerTracker.current = {};
        maybeCloseSubMenu();
      }}
      onClick={(e) => e.preventDefault()}
      aria-haspopup
      aria-expanded={isSubMenuOpen}
      dismissOnClick={false}
    />
  );
}

SubMenuTrigger.propTypes = {
  openSubMenu: PropTypes.func.isRequired,
  closeSubMenu: PropTypes.func.isRequired,
  isSubMenuOpen: PropTypes.bool.isRequired,
  isRTL: PropTypes.bool,
  subMenuRef: PropTypes.object.isRequired,
  parentMenuRef: PropTypes.object.isRequired,
};

export default SubMenuTrigger;
