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
import { useRef, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useGlobalKeyDownEffect, useKeyDownEffect } from '../keyboard';
import WithTooltip from '../tooltip';
import Popup, { Placement } from '../popup';
import { Keyboard as KeyboardShortcutsButton } from '../button';
import ShortcutMenu from './shortcutMenu';

function KeyboardShortcutsMenu({
  placement = Placement.TOP_END,
  spacing = { x: 0, y: 12 },
  onMenuToggled,
}) {
  const anchorRef = useRef();
  const isOpenBuffer = useRef(false);
  const isOpenSetTimeout = useRef(0);

  const [isOpen, setIsOpen] = useState(false);

  const tryToggleMenu = useCallback(
    (showMenu) => {
      isOpenBuffer.current = showMenu;

      // Stop previous timeout
      window.clearTimeout(isOpenSetTimeout.current);

      // Some toggle menu events can come in rapidly, to
      // ensure that we don't just toggle the menu closed
      // and then immediately open it, this little setTimeout
      // will make sure only the last toggle will actually
      // happen.
      isOpenSetTimeout.current = window.setTimeout(() => {
        setIsOpen(isOpenBuffer.current);
        if (onMenuToggled) {
          onMenuToggled(isOpenBuffer.current);
        }

        isOpenBuffer.current = false;
      }, 10);
    },
    [onMenuToggled]
  );

  const toggleMenu = useCallback(
    (_, showMenu) => {
      tryToggleMenu(showMenu ?? !isOpen);
    },
    [tryToggleMenu, isOpen]
  );

  useGlobalKeyDownEffect('mod+/', toggleMenu, [toggleMenu]);
  useKeyDownEffect(anchorRef, 'enter', toggleMenu, [toggleMenu]);

  useEffect(() => {
    return () => {
      // On unmount, stop any timeout that's been set.
      window.clearTimeout(isOpenSetTimeout.current);
    };
  }, []);

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
          disabled={true}
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
      <Popup
        anchor={anchorRef}
        isOpen={isOpen}
        placement={placement}
        spacing={spacing}
      >
        <ShortcutMenu toggleMenu={toggleMenu} />
      </Popup>
    </>
  );
}

KeyboardShortcutsMenu.propTypes = {
  placement: PropTypes.string,
  spacing: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  onMenuToggled: PropTypes.func,
};

export default KeyboardShortcutsMenu;
