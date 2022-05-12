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
import {
  useCopyPasteActions,
  useElementActions,
  useLayerActions,
  usePresetActions,
} from '../hooks';
import useLayerSelect from '../useLayerSelect';
import { LayerLock, LayerName } from '../items';
import { useStory } from '../..';
import useRightClickMenu from '../useRightClickMenu';
import {
  DEFAULT_DISPLACEMENT,
  MenuPropType,
  SubMenuContainer,
  SUB_MENU_ARIA_LABEL,
} from './shared';

function ShapeMenu({ parentMenuRef }) {
  const { copiedElementType, selectedElementType } = useStory(({ state }) => ({
    copiedElementType: state.copiedElementState.type,
    selectedElementType: state.selectedElements?.[0].type,
  }));
  const { handleCopyStyles, handlePasteStyles } = useCopyPasteActions();
  const { handleDuplicateSelectedElements } = useElementActions();
  const {
    canElementMoveBackwards,
    canElementMoveForwards,
    handleSendBackward,
    handleSendToBack,
    handleBringForward,
    handleBringToFront,
  } = useLayerActions();
  const { handleAddColorPreset } = usePresetActions();

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
        onClick={handleDuplicateSelectedElements}
      >
        {RIGHT_CLICK_MENU_LABELS.DUPLICATE_ELEMENTS(1)}
      </ContextMenuComponents.MenuButton>

      <ContextMenuComponents.MenuSeparator />

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
      
      <ContextMenuComponents.MenuSeparator />

      <ContextMenuComponents.MenuButton onClick={handleCopyStyles}>
        {RIGHT_CLICK_MENU_LABELS.COPY_SHAPE_STYLES}
        <ContextMenuComponents.MenuShortcut>
          {RIGHT_CLICK_MENU_SHORTCUTS.COPY_STYLES.display}
        </ContextMenuComponents.MenuShortcut>
      </ContextMenuComponents.MenuButton>
      <ContextMenuComponents.MenuButton
        disabled={copiedElementType !== selectedElementType}
        onClick={handlePasteStyles}
      >
        {RIGHT_CLICK_MENU_LABELS.PASTE_SHAPE_STYLES}
        <ContextMenuComponents.MenuShortcut>
          {RIGHT_CLICK_MENU_SHORTCUTS.PASTE_STYLES.display}
        </ContextMenuComponents.MenuShortcut>
      </ContextMenuComponents.MenuButton>
      <ContextMenuComponents.MenuButton onClick={handleAddColorPreset}>
        {RIGHT_CLICK_MENU_LABELS.ADD_TO_COLOR_PRESETS}
      </ContextMenuComponents.MenuButton>
    </>
  );
}
ShapeMenu.propTypes = MenuPropType;

export default ShapeMenu;
