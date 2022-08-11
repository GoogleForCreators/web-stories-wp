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
import {
  forwardRef,
  useLayoutEffect,
  useCallback,
  memo,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { __ } from '@googleforcreators/i18n';
import { ContextMenu, useLiveRegion } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { Z_INDEX_FLOATING_MENU } from '../../constants/zIndex';
import {
  useFocusGroupRef,
  FOCUS_GROUPS,
} from '../canvas/editLayerFocusManager';
import { FloatingMenuProvider } from './context';
import MenuSelector from './menus';

const FLOATING_MENU_MESSAGE = __(
  'To exit the floating menu, press Escape.',
  'web-stories'
);

const MenuWrapper = styled.section`
  display: flex;
  position: absolute;
  z-index: ${Z_INDEX_FLOATING_MENU};
  visibility: ${({ visuallyHidden }) =>
    visuallyHidden ? 'hidden' : 'visible'};
  transition: 140ms opacity;
`;

const FloatingMenu = memo(
  forwardRef(function FloatingMenu(
    { selectionIdentifier, selectedElementType, handleDismiss, visuallyHidden },
    ref
  ) {
    const focusGroupRef = useFocusGroupRef(FOCUS_GROUPS.EDIT_ELEMENT);
    const speak = useLiveRegion();

    const announceKeyboardControls = useCallback(() => {
      speak(FLOATING_MENU_MESSAGE);
    }, [speak]);

    useLayoutEffect(() => {
      const node = ref.current;
      const updateSize = () => {
        node.style.width = '';
        const bounds = node.getBoundingClientRect();
        node.style.setProperty('--width', `${bounds.width.toFixed(2)}px`);
        node.style.setProperty('--height', `${bounds.height.toFixed(2)}px`);
        node.style.width = 'var(--width)';
      };
      updateSize();
      // If the menu children list changes, update the size again
      const observer = new MutationObserver(updateSize);
      const menu = node.querySelector('[role=menu]');
      observer.observe(menu, { childList: true });
      return () => observer.disconnect();
    }, [ref, selectionIdentifier]);

    return (
      <MenuWrapper
        ref={ref}
        aria-label={__('Design menu', 'web-stories')}
        visuallyHidden={visuallyHidden}
      >
        <FloatingMenuProvider handleDismiss={handleDismiss}>
          <ContextMenu
            isInline
            isHorizontal
            isSecondary
            isAlwaysVisible
            tabIndex={-1}
            ref={focusGroupRef}
            dismissOnEscape={false}
            onFocus={announceKeyboardControls}
            aria-label={__(
              'Design options for selected element',
              'web-stories'
            )}
            onMouseDown={(e) => {
              // Stop the event from bubbling if the user clicks in between buttons.
              // This prevents the selected element in the canvas from losing focus.
              e.stopPropagation();
            }}
            popoverZIndex={Z_INDEX_FLOATING_MENU}
          >
            <MenuSelector selectedElementType={selectedElementType} />
          </ContextMenu>
        </FloatingMenuProvider>
      </MenuWrapper>
    );
  })
);

FloatingMenu.propTypes = {
  handleDismiss: PropTypes.func.isRequired,
  selectedElementType: PropTypes.string.isRequired,
  selectionIdentifier: PropTypes.string.isRequired,
  visuallyHidden: PropTypes.bool,
};

export default FloatingMenu;
