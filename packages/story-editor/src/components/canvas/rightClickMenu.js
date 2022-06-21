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
import { __ } from '@googleforcreators/i18n';
import { ContextMenu } from '@googleforcreators/design-system';
import {
  createPortal,
  useEffect,
  useMemo,
  useRef,
} from '@googleforcreators/react';
import { ELEMENT_TYPES } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { useRightClickMenu, useConfig } from '../../app';
import DirectionAware from '../directionAware';
import { useStory } from '../../app/story';
import {
  ForegroundMediaMenu,
  MultipleElementsMenu,
  PageMenu,
  ShapeMenu,
  StickerMenu,
  TextMenu,
  ProductMenu,
} from '../../app/rightClickMenu';
import isEmptyStory from '../../app/story/utils/isEmptyStory';
import EmptyStateMenu from '../../app/rightClickMenu/menus/emptyStateMenu';

const RightClickMenuContainer = styled.div`
  position: absolute;
  top: ${({ position }) => position?.y ?? 0}px;
  left: ${({ position }) => position?.x ?? 0}px;
  z-index: 9999;
`;

const RightClickMenu = () => {
  const { isRTL } = useConfig();
  const { selectedElements, isThisEmptyStory } = useStory((value) => ({
    selectedElements: value.state.selectedElements,
    isThisEmptyStory: isEmptyStory(value.state.pages),
  }));
  const { isMenuOpen, menuPosition, onCloseMenu, maskRef } =
    useRightClickMenu();
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

  const Menu = useMemo(() => {
    if (isThisEmptyStory) {
      return EmptyStateMenu;
    }

    if (selectedElements.length > 1) {
      return MultipleElementsMenu;
    }

    const selectedElement = selectedElements?.[0];

    if (selectedElement?.isDefaultBackground) {
      return PageMenu;
    }

    switch (selectedElement?.type) {
      case ELEMENT_TYPES.IMAGE:
      case ELEMENT_TYPES.VIDEO:
      case ELEMENT_TYPES.GIF:
        return selectedElement?.isBackground ? PageMenu : ForegroundMediaMenu;
      case ELEMENT_TYPES.SHAPE:
        return ShapeMenu;
      case ELEMENT_TYPES.TEXT:
        return TextMenu;
      case ELEMENT_TYPES.STICKER:
        return StickerMenu;
      case ELEMENT_TYPES.PRODUCT:
        return ProductMenu;
      default:
        return PageMenu;
    }
  }, [selectedElements, isThisEmptyStory]);

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
            aria-label={__(
              'Context Menu for the selected element',
              'web-stories'
            )}
            maskRef={maskRef}
            onMouseDown={(evt) => evt.stopPropagation()}
            isRTL={isRTL}
          >
            <Menu parentMenuRef={ref} />
          </ContextMenu>
        </DirectionAware>
      </RightClickMenuContainer>
    </StyleSheetManager>,
    document.body
  );
};

export default RightClickMenu;
