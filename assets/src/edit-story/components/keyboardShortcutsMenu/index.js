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
import styled from 'styled-components';
import { __ } from '@web-stories-wp/i18n';
import { trackEvent } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
  Tooltip,
  TOOLTIP_PLACEMENT,
  useGlobalKeyDownEffect,
  useFocusOut,
} from '../../../design-system';
import { useHelpCenter } from '../../app';
import { isKeyboardUser } from '../../utils/keyboardOnlyOutline';
import DirectionAware from '../directionAware';
import { Popup } from './popup';
import ShortcutMenu from './shortcutMenu';
import { TOGGLE_SHORTCUTS_MENU } from './constants';

const Wrapper = styled.div``;

function KeyboardShortcutsMenu() {
  const anchorRef = useRef();
  const wrapperRef = useRef();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = useCallback(() => setIsOpen(false), [setIsOpen]);
  const {
    close: closeHelpCenter,
  } = useHelpCenter(({ actions: { close } }) => ({ close }));

  const toggleMenu = useCallback(
    (e, showMenu) => {
      e.preventDefault();
      setIsOpen((prevIsOpen) => {
        const menuOpen = showMenu ?? !prevIsOpen;

        if (menuOpen) {
          closeHelpCenter();
        }

        if (isKeyboardUser() && !menuOpen) {
          // When menu closes, return focus to toggle menu button
          anchorRef.current.focus?.();
        }

        trackEvent('shortcuts_menu_toggled', {
          status: menuOpen ? 'open' : 'closed',
        });
        return menuOpen;
      });
    },
    [closeHelpCenter]
  );

  useGlobalKeyDownEffect(TOGGLE_SHORTCUTS_MENU, toggleMenu, [toggleMenu]);
  useFocusOut(wrapperRef, closeMenu, []);

  return (
    <DirectionAware>
      <Wrapper ref={wrapperRef}>
        <Tooltip
          title={__('Toggle Keyboard Shortcuts', 'web-stories')}
          placement={TOOLTIP_PLACEMENT.TOP}
          shortcut="mod+/"
          hasTail
        >
          <Button
            ref={anchorRef}
            variant={BUTTON_VARIANTS.SQUARE}
            type={BUTTON_TYPES.TERTIARY}
            size={BUTTON_SIZES.SMALL}
            aria-label={__('Keyboard Shortcuts', 'web-stories')}
            aria-haspopup
            aria-expanded={isOpen}
            onClick={toggleMenu}
          >
            <Icons.Keyboard />
          </Button>
        </Tooltip>
        <Popup isOpen={isOpen}>
          <ShortcutMenu toggleMenu={toggleMenu} />
        </Popup>
      </Wrapper>
    </DirectionAware>
  );
}

export default KeyboardShortcutsMenu;
