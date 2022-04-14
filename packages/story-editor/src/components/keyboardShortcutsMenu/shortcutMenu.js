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
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import {
  useEffect,
  useRef,
  useIsomorphicLayoutEffect,
  useState,
} from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
  themeHelpers,
  useKeyDownEffect,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { ADMIN_TOOLBAR_HEIGHT, HEADER_HEIGHT } from '../../constants';
import HeaderShortcut from './headerShortcut';
import LandmarkShortcuts from './landmarkShortcuts';
import RegularShortcuts from './regularShortcuts';
import { TOGGLE_SHORTCUTS_MENU, TOP_MARGIN } from './constants';
import { useKeyboardShortcutsMenu } from './keyboardShortcutsMenuContext';

const BORDER_WIDTH = 1;
const Container = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 352px;
  border-radius: ${({ theme }) => theme.borders.radius.small};
  background-color: ${({ theme }) => theme.colors.bg.primary};
  border: ${BORDER_WIDTH}px solid
    ${({ theme }) => theme.colors.border.defaultNormal};
`;

// How much less space than the full browser height can the popup occupy?
const EXTRA_SPACE =
  ADMIN_TOOLBAR_HEIGHT + HEADER_HEIGHT + TOP_MARGIN - 2 * BORDER_WIDTH;
const FlexContent = styled.div`
  display: flex;
  flex-direction: column;
  max-height: calc(
    100vh - ${EXTRA_SPACE}px - ${({ bottomOffset }) => bottomOffset}px
  );
`;

const CloseContainer = styled.div`
  position: absolute;
  right: 4px;
  top: 4px;
`;

const ScrollableContent = styled.div`
  overflow: auto;
  flex-shrink: 1;

  ${themeHelpers.focusableOutlineCSS};
`;

const HEADER_ID = `kb-header-${uuidv4()}`;

function ShortcutMenu() {
  const anchorRef = useRef();
  const containerRef = useRef();

  const { close, toggleMenu, isOpen } = useKeyboardShortcutsMenu(
    ({ actions, state }) => ({
      toggleMenu: actions.toggleMenu,
      close: actions.close,
      isOpen: state.isOpen,
    })
  );

  const [bottomOffset, setBottomOffset] = useState(0);
  useIsomorphicLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) {
      return undefined;
    }
    const calc = () => {
      // Find node bottom offset from bottom of browser window
      const nodeRect = node.getBoundingClientRect();
      const docRect =
        node.ownerDocument.documentElement.getBoundingClientRect();
      setBottomOffset(docRect.height - nodeRect.y - nodeRect.height);
    };
    // Call it now
    calc();
    // Call it in a frame
    // eslint-disable-next-line @wordpress/react-no-unsafe-timeout -- No need to cancel this one
    setTimeout(calc);
    // And call it every time the window resizes
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  useEffect(() => {
    if (isOpen && anchorRef.current) {
      anchorRef.current.focus();
    }
  }, [isOpen]);

  useKeyDownEffect(containerRef, TOGGLE_SHORTCUTS_MENU, toggleMenu, [
    toggleMenu,
  ]);

  useKeyDownEffect(containerRef, 'esc', close);

  return (
    <Container ref={containerRef}>
      <CloseContainer>
        <Button
          ref={anchorRef}
          type={BUTTON_TYPES.PLAIN}
          size={BUTTON_SIZES.SMALL}
          variant={BUTTON_VARIANTS.CIRCLE}
          onClick={close}
          aria-label={__('Close Menu', 'web-stories')}
        >
          <Icons.Cross />
        </Button>
      </CloseContainer>

      <FlexContent bottomOffset={bottomOffset}>
        <HeaderShortcut id={HEADER_ID} />
        {/*eslint-disable-next-line styled-components-a11y/no-noninteractive-tabindex -- scrollable content must be scrollable with keyboard */}
        <ScrollableContent role="presentation" tabIndex={0}>
          <LandmarkShortcuts />
          <RegularShortcuts />
        </ScrollableContent>
      </FlexContent>
    </Container>
  );
}

export default ShortcutMenu;
