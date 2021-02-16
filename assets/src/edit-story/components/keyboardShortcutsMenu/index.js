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
import styled, { StyleSheetManager } from 'styled-components';
import stylisRTLPlugin from 'stylis-plugin-rtl';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { isKeyboardUser } from '../../utils/keyboardOnlyOutline';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
  useGlobalKeyDownEffect,
  Tooltip,
  TOOLTIP_PLACEMENT,
} from '../../../design-system';
import { useConfig } from '../../app';
import { Popup } from './popup';
import ShortcutMenu from './shortcutMenu';
import { TOGGLE_SHORTCUTS_MENU } from './constants';

const Wrapper = styled.div``;

const withRTLPlugins = [stylisRTLPlugin];
const withoutRTLPlugins = [];

function KeyboardShortcutsMenu() {
  const anchorRef = useRef();
  const wrapperRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const { isRTL } = useConfig();

  const toggleMenu = useCallback((e, showMenu) => {
    e.preventDefault();
    setIsOpen((prevIsOpen) => {
      const menuOpen = showMenu ?? !prevIsOpen;

      if (isKeyboardUser() && !menuOpen) {
        // When menu closes, return focus to toggle menu button
        anchorRef.current.focus?.();
      }

      return menuOpen;
    });
  }, []);

  useGlobalKeyDownEffect(TOGGLE_SHORTCUTS_MENU, toggleMenu, [toggleMenu]);

  return (
    <StyleSheetManager
      stylisPlugins={isRTL ? withRTLPlugins : withoutRTLPlugins}
    >
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
            aria-haspopup={true}
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
    </StyleSheetManager>
  );
}

export default KeyboardShortcutsMenu;
