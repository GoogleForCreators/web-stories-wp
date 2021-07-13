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
import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { __ } from '@web-stories-wp/i18n';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
  TOOLTIP_PLACEMENT,
  useGlobalKeyDownEffect,
  useFocusOut,
} from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import { isKeyboardUser } from '../../utils/keyboardOnlyOutline';
import DirectionAware from '../directionAware';
import Tooltip from '../tooltip';
import { Popup } from './popup';
import ShortcutMenu from './shortcutMenu';
import { TOGGLE_SHORTCUTS_MENU } from './constants';
import { useKeyboardShortcutsMenu } from './keyboardShortcutsMenuContext';

const Wrapper = styled.div``;

function KeyboardShortcutsMenu() {
  const anchorRef = useRef();
  const wrapperRef = useRef();
  const { close, toggle, isOpen } = useKeyboardShortcutsMenu(
    ({ actions: { close, toggle }, state: { isOpen } }) => ({
      close,
      toggle,
      isOpen,
    })
  );

  useEffect(() => {
    if (isKeyboardUser() && !isOpen) {
      // When menu closes, return focus to toggle menu button
      anchorRef.current.focus?.();
    }
  }, [isOpen]);

  useGlobalKeyDownEffect(TOGGLE_SHORTCUTS_MENU, toggle, [toggle]);
  useFocusOut(wrapperRef, close, [close]);

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
            onClick={toggle}
          >
            <Icons.Keyboard />
          </Button>
        </Tooltip>
        <Popup isOpen={isOpen}>
          <ShortcutMenu toggleMenu={toggle} />
        </Popup>
      </Wrapper>
    </DirectionAware>
  );
}

export default KeyboardShortcutsMenu;
