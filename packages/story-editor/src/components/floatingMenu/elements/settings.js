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
  ContextMenu,
  ContextMenuComponents,
  Icons,
  LOCAL_STORAGE_PREFIX,
  localStore,
} from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from '@googleforcreators/react';
import styled from 'styled-components';
import { trackEvent } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import { TOOLBAR_POSITIONS } from '../constants';
import { useCanvas } from '../../../app';
import { states, useHighlights } from '../../../app/highlights';
import { IconButton } from './shared';

const StyledIconButton = styled(IconButton)`
  svg {
    width: 24px;
    height: 24px;
  }
`;

const OFFSET_X = -8;
const OFFSET_Y = 3;

const SubMenuContainer = styled.div`
  position: absolute;
  top: calc(var(--height) + ${OFFSET_Y}px);
  z-index: 9999;
`;
const LOCAL_STORAGE_KEY = LOCAL_STORAGE_PREFIX.ELEMENT_TOOLBAR_SETTINGS;

function Settings() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    setFloatingMenuPosition,
    setDisplayFloatingMenu,
    floatingMenuPosition,
  } = useCanvas(({ actions, state }) => ({
    setFloatingMenuPosition: actions.setFloatingMenuPosition,
    setDisplayFloatingMenu: actions.setDisplayFloatingMenu,
    floatingMenuPosition: state.floatingMenuPosition,
  }));
  const setHighlights = useHighlights(({ setHighlights }) => setHighlights);

  const buttonRef = useRef();
  const subMenuRef = useRef();

  const [offsetLeft, setOffsetLeft] = useState(0);

  // Record left position of this button in the parent design menu
  useEffect(
    () => setOffsetLeft(buttonRef.current.parentNode.offsetLeft + OFFSET_X),
    []
  );

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
    buttonRef.current.focus();
  };

  const local = useMemo(
    () => localStore.getItemByKey(LOCAL_STORAGE_KEY) || {},
    []
  );
  const handleToolbarPosition = (position) => {
    setFloatingMenuPosition(position);
    localStore.setItemByKey(LOCAL_STORAGE_KEY, {
      ...local,
      position,
    });
    trackEvent('floating_menu', {
      name: 'reposition_menu',
      position,
    });
  };

  const hideFloatingMenu = useCallback(() => {
    setDisplayFloatingMenu(false);
    localStore.setItemByKey(LOCAL_STORAGE_KEY, {
      ...local,
      isDisplayed: false,
    });
    setHighlights({
      highlight: states.ELEMENT_TOOLBAR_TOGGLE,
    });
    trackEvent('floating_menu', {
      name: 'persistent_menu_hide',
    });
  }, [local, setDisplayFloatingMenu, setHighlights]);

  const subMenuItems = [
    {
      key: TOOLBAR_POSITIONS.ELEMENT,
      label: <span>{__('Fix to element', 'web-stories')}</span>,
      onClick: () => handleToolbarPosition(TOOLBAR_POSITIONS.ELEMENT),
      supportsIcon: true,
      icon:
        !floatingMenuPosition ||
        floatingMenuPosition === TOOLBAR_POSITIONS.ELEMENT ? (
          <Icons.CheckmarkSmall />
        ) : null,
    },
    {
      key: TOOLBAR_POSITIONS.TOP,
      label: <span>{__('Fix to top', 'web-stories')}</span>,
      onClick: () => handleToolbarPosition(TOOLBAR_POSITIONS.TOP),
      supportsIcon: true,
      icon:
        floatingMenuPosition === TOOLBAR_POSITIONS.TOP ? (
          <Icons.CheckmarkSmall />
        ) : null,
    },
    {
      key: 'hide',
      label: <span>{__('Always hide', 'web-stories')}</span>,
      // Note: this doesn't really support icon but this way there's the same amount of padding as the other items have.
      supportsIcon: true,
      onClick: () => hideFloatingMenu(),
    },
  ];

  return (
    <>
      <StyledIconButton
        ref={buttonRef}
        Icon={Icons.Settings}
        title={__('Menu settings', 'web-stories')}
        onClick={() => setIsMenuOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
      />
      <SubMenuContainer ref={subMenuRef} style={{ left: `${offsetLeft}px` }}>
        <ContextMenu
          onDismiss={handleCloseMenu}
          isOpen={isMenuOpen}
          onCloseSubMenu={handleCloseMenu}
          aria-label={__('Toolbar position options', 'web-stories')}
          isSubMenu
          isSecondary
          parentMenuRef={buttonRef}
        >
          {subMenuItems.map(({ key, ...menuItemProps }) => (
            <ContextMenuComponents.MenuItem key={key} {...menuItemProps} />
          ))}
        </ContextMenu>
      </SubMenuContainer>
    </>
  );
}

export default Settings;
