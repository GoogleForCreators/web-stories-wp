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
import styled, { StyleSheetManager } from 'styled-components';
import { __ } from '@web-stories-wp/i18n';
import {
  ContextMenu,
  ContextMenuComponents,
} from '@web-stories-wp/design-system';
import { createPortal, useRef, useEffect } from '@web-stories-wp/react';

/**
 * Internal dependencies
 */
import { useRightClickMenu, useConfig } from '../../app';
import DirectionAware from '../directionAware';

const RightClickMenuContainer = styled.div`
  position: absolute;
  top: ${({ position }) => position?.y ?? 0}px;
  left: ${({ position }) => position?.x ?? 0}px;
  z-index: 9999;
`;

const RightClickMenu = () => {
  const { isRTL } = useConfig();
  const {
    isMenuOpen,
    menuItems: rightClickMenuItems,
    menuPosition,
    onCloseMenu,
    maskRef,
  } = useRightClickMenu();
  const ref = useRef();

  /**
   * Prevent browser's context menu when right clicking on custom ContextMenu
   *
   * @param {Object} evt Triggering event
   */
  const preventAdditionalContext = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
  };

  useEffect(() => {
    const node = ref.current;

    node.addEventListener('contextmenu', preventAdditionalContext);
    return () => {
      node.removeEventListener('contextmenu', preventAdditionalContext);
    };
  }, [ref]);

  return createPortal(
    <StyleSheetManager stylisPlugins={[]}>
      <RightClickMenuContainer position={menuPosition} ref={ref}>
        <DirectionAware>
          <ContextMenu
            data-testid="right-click-context-menu"
            isOpen={isMenuOpen}
            onDismiss={onCloseMenu}
            groupLabel={__(
              'Context Menu for the selected element',
              'web-stories'
            )}
            maskRef={maskRef}
            onMouseDown={(evt) => evt.stopPropagation()}
            isRTL={isRTL}
          >
            {rightClickMenuItems.map(
              ({ label, shortcut, separator, ...buttonProps }) => (
                <>
                  {separator === 'top' && <ContextMenuComponents.Separator />}
                  <ContextMenuComponents.Button key={label} {...buttonProps}>
                    {label}
                    {shortcut && (
                      <ContextMenuComponents.Shortcut>
                        {shortcut.display}
                      </ContextMenuComponents.Shortcut>
                    )}
                  </ContextMenuComponents.Button>
                  {separator === 'bottom' && (
                    <ContextMenuComponents.Separator />
                  )}
                </>
              )
            )}
          </ContextMenu>
        </DirectionAware>
      </RightClickMenuContainer>
    </StyleSheetManager>,
    document.body
  );
};

export default RightClickMenu;
