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
import { forwardRef, useLayoutEffect } from '@googleforcreators/react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { __ } from '@googleforcreators/i18n';
import {
  ContextMenu,
  ContextMenuComponents,
  Icons,
  TOOLTIP_PLACEMENT,
} from '@googleforcreators/design-system';

const MenuWrapper = styled.section`
  position: absolute;
  z-index: 2;
`;

const FloatingMenu = forwardRef(function FloatingMenu(props, ref) {
  useLayoutEffect(() => {
    const node = ref.current;
    const bounds = node.getBoundingClientRect();
    node.style.setProperty('--width', `${bounds.width.toFixed(2)}px`);
    node.style.setProperty('--height', `${bounds.height.toFixed(2)}px`);
  }, [ref]);

  return (
    <MenuWrapper ref={ref} aria-label={__('Design menu', 'web-stories')}>
      <ContextMenu
        isInline
        isHorizontal
        isSecondary
        isAlwaysVisible
        disableControlledTabNavigation
        aria-label={__('Design options for selected element', 'web-stories')}
        onMouseDown={(e) => {
          // Stop the event from bubbling if the user clicks in between buttons.
          // This prevents the selected element in the canvas from losing focus.
          e.stopPropagation();
        }}
      >
        <ContextMenuComponents.MenuButton>
          <ContextMenuComponents.MenuIcon
            title="Exclaim!"
            placement={TOOLTIP_PLACEMENT.BOTTOM}
          >
            <Icons.ExclamationOutline />
          </ContextMenuComponents.MenuIcon>
        </ContextMenuComponents.MenuButton>
        <ContextMenuComponents.MenuButton>
          <ContextMenuComponents.MenuIcon
            title="Bucket!"
            placement={TOOLTIP_PLACEMENT.BOTTOM}
          >
            <Icons.ColorBucket />
          </ContextMenuComponents.MenuIcon>
        </ContextMenuComponents.MenuButton>
        <ContextMenuComponents.MenuButton>
          <ContextMenuComponents.MenuIcon
            title="Letter Arrow!"
            placement={TOOLTIP_PLACEMENT.BOTTOM}
          >
            <Icons.LetterTArrow />
          </ContextMenuComponents.MenuIcon>
        </ContextMenuComponents.MenuButton>
        <ContextMenuComponents.MenuSeparator />
        <ContextMenuComponents.MenuButton>
          <ContextMenuComponents.MenuIcon
            title="Pipette!"
            placement={TOOLTIP_PLACEMENT.BOTTOM}
          >
            <Icons.Pipette />
          </ContextMenuComponents.MenuIcon>
        </ContextMenuComponents.MenuButton>
        <ContextMenuComponents.MenuSeparator />
        <ContextMenuComponents.MenuButton>
          <ContextMenuComponents.MenuIcon
            title="Dismiss menu"
            placement={TOOLTIP_PLACEMENT.BOTTOM}
          >
            <Icons.Cross />
          </ContextMenuComponents.MenuIcon>
        </ContextMenuComponents.MenuButton>
      </ContextMenu>
    </MenuWrapper>
  );
});

FloatingMenu.propTypes = {
  isVisible: PropTypes.bool,
};

export default FloatingMenu;
