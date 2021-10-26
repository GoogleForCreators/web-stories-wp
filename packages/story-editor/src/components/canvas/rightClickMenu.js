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
import { __ } from '@web-stories-wp/i18n';
import { ContextMenu } from '@web-stories-wp/design-system';
import { createPortal, useRef, useEffect } from '@web-stories-wp/react';
import styled from 'styled-components';
/**
 * Internal dependencies
 */
import { useRightClickMenu } from '../../app';
import DirectionAware from '../directionAware';

const RightClickMenuContainer = styled.div`
  position: absolute;
  top: ${({ position }) => position?.y ?? 0}px;
  left: ${({ position }) => position?.x ?? 0}px;
  z-index: 9999;
`;

const RightClickMenu = () => {
  const {
    isMenuOpen,
    menuItems: rightClickMenuItems,
    menuPosition,
    onCloseMenu,
    maskRef,
  } = useRightClickMenu();
  const ref = useRef();
  // If ContextMenu is already rendered prevent browser's context menu when right clicking on ContextMenu
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
    <DirectionAware>
      <RightClickMenuContainer position={menuPosition} ref={ref}>
        <ContextMenu
          animate
          data-testid="right-click-context-menu"
          isOpen={isMenuOpen}
          onDismiss={onCloseMenu}
          items={rightClickMenuItems}
          groupLabel={__(
            'Context Menu for the selected element',
            'web-stories'
          )}
          maskRef={maskRef}
          onMouseDown={(evt) => evt.stopPropagation()}
        />
      </RightClickMenuContainer>
    </DirectionAware>,
    document.body
  );
};

export default RightClickMenu;
