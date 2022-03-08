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
import { useState, useRef, useEffect } from '@googleforcreators/react';
import {
  Icons,
  ContextMenu,
  ContextMenuComponents,
  TOOLTIP_PLACEMENT,
} from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { IconButton, useProperties } from './shared';

const OFFSET_X = -8;
const OFFSET_Y = 3;

const SubMenuContainer = styled.div`
  position: absolute;
  top: calc(var(--height) + ${OFFSET_Y}px);
  z-index: 9999;
`;

const StyledMenuButton = styled(ContextMenuComponents.MenuButton)`
  flex: 0 0 60px;
  height: 36px;
  border: 1px solid #393d3f;
  padding: 2px 0;
  border-radius: 4px;
`;

const StyledMenuIcon = styled(ContextMenuComponents.MenuIcon)`
  width: auto;
  display: flex;
  overflow: hidden;

  svg {
    width: 32px;
  }

  svg:last-child {
    margin-left: -8px;
  }
`;

const ALIGNMENTS = [
  {
    value: 'left',
    icon: Icons.AlignTextLeft,
    label: __('Align text left', 'web-stories'),
  },
  {
    value: 'center',
    icon: Icons.AlignTextCenter,
    label: __('Align text center', 'web-stories'),
  },
  {
    value: 'right',
    icon: Icons.AlignTextRight,
    label: __('Align text right', 'web-stories'),
  },
  {
    value: 'justify',
    icon: Icons.AlignTextJustified,
    label: __('Align text justified', 'web-stories'),
  },
];

function TextAlign() {
  const { textAlign = 'left' } = useProperties(['textAlign']);
  const updateSelectedElements = useStory(
    (state) => state.actions.updateSelectedElements
  );

  const [isMenuOpen, setMenuOpen] = useState(false);
  const subMenuRef = useRef();
  const buttonRef = useRef();
  const [offsetLeft, setOffsetLeft] = useState(0);

  // Record left position of this button in the parent design menu
  useEffect(() => setOffsetLeft(buttonRef.current.offsetLeft + OFFSET_X), []);

  // Only display tooltip while menu is not open
  const tooltip = isMenuOpen ? '' : __('Change text alignment', 'web-stories');

  // When menu has just opened, focus the current button in submenu
  const currentIconMounted = (node) => {
    if (node) {
      /* eslint-disable-next-line @wordpress/react-no-unsafe-timeout
         --------
         We have to wait a frame for the parent to have rendered
      */
      setTimeout(() => node.focus());
    }
  };

  const CurrentIcon =
    ALIGNMENTS.find(({ value }) => value === textAlign)?.icon ||
    Icons.AlignTextLeft;

  const handleTextAlign = (value) => () =>
    updateSelectedElements({
      properties: { textAlign: value },
    });

  const handleCloseMenu = () => {
    setMenuOpen(false);
    buttonRef.current.focus();
  };

  return (
    <>
      <StyledMenuButton
        ref={buttonRef}
        onClick={() => setMenuOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
      >
        <StyledMenuIcon title={tooltip} placement={TOOLTIP_PLACEMENT.BOTTOM}>
          <CurrentIcon />
          <Icons.ChevronDownSmall />
        </StyledMenuIcon>
      </StyledMenuButton>
      <SubMenuContainer ref={subMenuRef} style={{ left: `${offsetLeft}px` }}>
        <ContextMenu
          onDismiss={handleCloseMenu}
          isOpen={isMenuOpen}
          onCloseSubMenu={handleCloseMenu}
          aria-label={__('Text alignment options', 'web-stories')}
          isSubMenu
          isSecondary
          parentMenuRef={buttonRef}
          isHorizontal
        >
          {ALIGNMENTS.map(({ value, icon, label }) => (
            <IconButton
              isToggled={value === textAlign}
              ref={value === textAlign ? currentIconMounted : null}
              key={value}
              Icon={icon}
              title={label}
              onClick={handleTextAlign(value)}
            />
          ))}
        </ContextMenu>
      </SubMenuContainer>
    </>
  );
}

export default TextAlign;
