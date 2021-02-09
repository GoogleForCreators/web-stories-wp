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
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import {
  Button,
  Icons,
  BUTTON_VARIANTS,
  BUTTON_TYPES,
  BUTTON_SIZES,
  useGlobalKeyDownEffect,
} from '../../../design-system';
import { isKeyboardUser } from '../../utils/keyboardOnlyOutline';
import WithTooltip from '../tooltip';
import { Placement } from '../popup';
import Modal from '../modal';
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

        if (isKeyboardUser() && !menuOpen) {
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
        title={__('Open Keyboard Shortcuts', 'web-stories')}
        placement={Placement.TOP}
      >
        <Button
          ref={anchorRef}
          variant={BUTTON_VARIANTS.SQUARE}
          type={BUTTON_TYPES.PLAIN}
          size={BUTTON_SIZES.SMALL}
          aria-pressed={isOpen}
          aria-haspopup={true}
          aria-expanded={isOpen}
          aria-label={__('Open Keyboard Shortcuts', 'web-stories')}
          onClick={toggleMenu}
        >
          <Icons.KeyboardShortcut />
        </Button>
      </WithTooltip>
      <Modal
        contentLabel={__('Keyboard Shortcuts Menu', 'web-stories')}
        open={isOpen}
        onClose={toggleMenu}
      >
        <ShortcutMenu toggleMenu={toggleMenu} />
      </Modal>
    </>
  );
}

KeyboardShortcutsMenu.propTypes = {
  onMenuToggled: PropTypes.func,
};

export default KeyboardShortcutsMenu;
