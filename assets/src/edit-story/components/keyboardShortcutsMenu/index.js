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
import { useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { isKeyboardUser } from '../../utils/keyboardOnlyOutline';
import { useGlobalKeyDownEffect } from '../keyboard';
import WithTooltip from '../tooltip';
import { Placement } from '../popup';
import Modal from '../modal';
import { Keyboard as KeyboardShortcutsButton } from '../button';
import ShortcutMenu from './shortcutMenu';
import { TOGGLE_SHORTCUTS_MENU } from './constants';

function KeyboardShortcutsMenu({ onMenuToggled }) {
  const anchorRef = useRef();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = useCallback(
    (e, showMenu) => {
      e.preventDefault();

      setIsOpen((prevIsOpen) => {
        const menuOpen = showMenu ?? !prevIsOpen;

        if (onMenuToggled) {
          onMenuToggled(menuOpen);
        }

        if (isKeyboardUser && !menuOpen) {
          // When menu closes, return focus to toggle menu button
          anchorRef.current.focus?.();
        }

        return menuOpen;
      });
    },
    [onMenuToggled]
  );

  useGlobalKeyDownEffect(TOGGLE_SHORTCUTS_MENU, toggleMenu, [toggleMenu]);

  return (
    <>
      <WithTooltip
        title={
          isOpen
            ? __('Close Keyboard Shortcuts', 'web-stories')
            : __('Open Keyboard Shortcuts', 'web-stories')
        }
        placement={Placement.LEFT}
      >
        <KeyboardShortcutsButton
          ref={anchorRef}
          width="24"
          height="24"
          aria-pressed={isOpen}
          aria-haspopup={true}
          aria-expanded={isOpen}
          aria-label={
            isOpen
              ? __('Close Keyboard Shortcuts', 'web-stories')
              : __('Open Keyboard Shortcuts', 'web-stories')
          }
          onClick={toggleMenu}
        />
      </WithTooltip>
      <Modal open={isOpen} onClose={toggleMenu}>
        <ShortcutMenu toggleMenu={toggleMenu} />
      </Modal>
    </>
  );
}

KeyboardShortcutsMenu.propTypes = {
  onMenuToggled: PropTypes.func,
};

export default KeyboardShortcutsMenu;
