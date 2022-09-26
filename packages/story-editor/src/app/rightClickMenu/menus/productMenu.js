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
} from '@googleforcreators/design-system';
import { useRef } from '@googleforcreators/react';
/**
 * Internal dependencies
 */
import {
  RIGHT_CLICK_MENU_LABELS,
  RIGHT_CLICK_MENU_SHORTCUTS,
} from '../constants';
import { useLayerActions } from '../hooks';
import useLayerSelect from '../useLayerSelect';
import { LayerLock, LayerName, LayerUngroup } from '../items';
import useRightClickMenu from '../useRightClickMenu';
import {
  DEFAULT_DISPLACEMENT,
  MenuPropType,
  SubMenuContainer,
  SUB_MENU_ARIA_LABEL,
} from './shared';

function ProductMenu({ parentMenuRef }) {
  const {
    canElementMoveBackwards,
    canElementMoveForwards,
    handleSendBackward,
    handleSendToBack,
    handleBringForward,
    handleBringToFront,
  } = useLayerActions();

  const subMenuRef = useRef();
  const { menuPosition, onCloseMenu } = useRightClickMenu();
  const layerSelectProps = useLayerSelect({
    menuPosition,
    isMenuOpen: true,
  });

  const { closeSubMenu, isSubMenuOpen, subMenuItems, ...subMenuTriggerProps } =
    layerSelectProps || {};

  return (
    <>
      {layerSelectProps && (
        <>
          <ContextMenuComponents.SubMenuTrigger
            closeSubMenu={closeSubMenu}
            parentMenuRef={parentMenuRef}
            subMenuRef={subMenuRef}
            isSubMenuOpen={isSubMenuOpen}
            {...subMenuTriggerProps}
          />
          <SubMenuContainer
            ref={subMenuRef}
            position={{
              x:
                (parentMenuRef.current.firstChild?.offsetWidth ||
                  DEFAULT_DISPLACEMENT) + 2,
              y: 0,
            }}
          >
            <ContextMenu
              onDismiss={onCloseMenu}
              isOpen={isSubMenuOpen}
              onCloseSubMenu={closeSubMenu}
              aria-label={SUB_MENU_ARIA_LABEL}
              isSubMenu
              parentMenuRef={parentMenuRef}
            >
              {subMenuItems.map(({ key, ...menuItemProps }) => (
                <ContextMenuComponents.MenuItem key={key} {...menuItemProps} />
              ))}
            </ContextMenu>
          </SubMenuContainer>
          <ContextMenuComponents.MenuSeparator />
        </>
      )}

      <ContextMenuComponents.MenuButton
        disabled={!canElementMoveBackwards}
        onClick={handleSendBackward}
      >
        {RIGHT_CLICK_MENU_LABELS.SEND_BACKWARD}
        <ContextMenuComponents.MenuShortcut>
          {RIGHT_CLICK_MENU_SHORTCUTS.SEND_BACKWARD.display}
        </ContextMenuComponents.MenuShortcut>
      </ContextMenuComponents.MenuButton>
      <ContextMenuComponents.MenuButton
        disabled={!canElementMoveBackwards}
        onClick={handleSendToBack}
      >
        {RIGHT_CLICK_MENU_LABELS.SEND_TO_BACK}
        <ContextMenuComponents.MenuShortcut>
          {RIGHT_CLICK_MENU_SHORTCUTS.SEND_TO_BACK.display}
        </ContextMenuComponents.MenuShortcut>
      </ContextMenuComponents.MenuButton>
      <ContextMenuComponents.MenuButton
        disabled={!canElementMoveForwards}
        onClick={handleBringForward}
      >
        {RIGHT_CLICK_MENU_LABELS.BRING_FORWARD}
        <ContextMenuComponents.MenuShortcut>
          {RIGHT_CLICK_MENU_SHORTCUTS.BRING_FORWARD.display}
        </ContextMenuComponents.MenuShortcut>
      </ContextMenuComponents.MenuButton>
      <ContextMenuComponents.MenuButton
        disabled={!canElementMoveForwards}
        onClick={handleBringToFront}
      >
        {RIGHT_CLICK_MENU_LABELS.BRING_TO_FRONT}
        <ContextMenuComponents.MenuShortcut>
          {RIGHT_CLICK_MENU_SHORTCUTS.BRING_TO_FRONT.display}
        </ContextMenuComponents.MenuShortcut>
      </ContextMenuComponents.MenuButton>

      <LayerName />
      <LayerLock />
      <LayerUngroup />
    </>
  );
}
ProductMenu.propTypes = MenuPropType;

export default ProductMenu;
