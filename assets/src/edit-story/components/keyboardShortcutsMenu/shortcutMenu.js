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
import {
  useCallback,
  useEffect,
  useRef,
  useLayoutEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { __ } from '@web-stories-wp/i18n';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
  useKeyDownEffect,
} from '../../../design-system';
import { isKeyboardUser } from '../../utils/keyboardOnlyOutline';
import useFocusTrapping from '../../utils/useFocusTrapping';
import { ADMIN_TOOLBAR_HEIGHT, HEADER_HEIGHT } from '../../constants';
import HeaderShortcut from './headerShortcut';
import LandmarkShortcuts from './landmarkShortcuts';
import RegularShortcuts from './regularShortcuts';
import { TOGGLE_SHORTCUTS_MENU, TOP_MARGIN } from './constants';

const BORDER_WIDTH = 1;
const Container = styled.div`
  position: absolute;
  right: 0;
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

const CloseContainer = styled.aside`
  position: absolute;
  right: 4px;
  top: 4px;
`;

const ScrollableContent = styled.div`
  overflow: auto;
  flex-shrink: 1;
`;

const HEADER_ID = `kb-header-${uuidv4()}`;

function ShortcutMenu({ toggleMenu }) {
  const containerRef = useRef();
  const closeRef = useRef();

  const [bottomOffset, setBottomOffset] = useState(0);
  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) {
      return undefined;
    }
    const calc = () => {
      // Find node bottom offset from bottom of browser window
      const nodeRect = node.getBoundingClientRect();
      const docRect = node.ownerDocument.documentElement.getBoundingClientRect();
      setBottomOffset(docRect.height - nodeRect.y - nodeRect.height);
    };
    // Call it now
    calc();
    // Call it in a frame
    // Disable reason: No need to cancel this one
    // eslint-disable-next-line @wordpress/react-no-unsafe-timeout
    setTimeout(calc);
    // And call it every time the window resizes
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  const handleCloseClick = useCallback((e) => toggleMenu(e, false), [
    toggleMenu,
  ]);

  useEffect(() => {
    // When the popup opens, move focus inside it
    // However, only move it to the close button if the user actually uses the keyboard
    // otherwise the close button hover state will be triggered for a mouse user.
    const targetRef = isKeyboardUser() ? closeRef : containerRef;
    targetRef.current?.focus?.();
  }, []);

  useKeyDownEffect(containerRef, TOGGLE_SHORTCUTS_MENU, toggleMenu, [
    toggleMenu,
  ]);

  useKeyDownEffect(containerRef, 'esc', toggleMenu);
  useFocusTrapping({ ref: containerRef });

  const closeLabel = __('Close menu', 'web-stories');

  return (
    <Container
      ref={containerRef}
      tabIndex="-1"
      role="list"
      aria-labelledby={HEADER_ID}
    >
      <CloseContainer>
        <Button
          variant={BUTTON_VARIANTS.SQUARE}
          type={BUTTON_TYPES.TERTIARY}
          size={BUTTON_SIZES.SMALL}
          ref={closeRef}
          onClick={handleCloseClick}
          title={closeLabel}
          aria-label={closeLabel}
        >
          <Icons.CrossSmall />
        </Button>
      </CloseContainer>
      <FlexContent bottomOffset={bottomOffset}>
        <HeaderShortcut id={HEADER_ID} />
        <ScrollableContent>
          <LandmarkShortcuts />
          <RegularShortcuts />
        </ScrollableContent>
      </FlexContent>
    </Container>
  );
}

ShortcutMenu.propTypes = {
  toggleMenu: PropTypes.func.isRequired,
};

export default ShortcutMenu;
