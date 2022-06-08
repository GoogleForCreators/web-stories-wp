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
} from '../hooks';
import { useStory, useLocalMedia } from '../..';
import useVideoTrim from '../../../components/videoTrim/useVideoTrim';
import useRightClickMenu from '../useRightClickMenu';
import useLayerSelect from '../useLayerSelect';
import { LayerLock, LayerName, LayerUngroup } from '../items';
import {
  DEFAULT_DISPLACEMENT,
  MenuPropType,
  SubMenuContainer,
  SUB_MENU_ARIA_LABEL,
} from './shared';

function ForegroundMediaMenu({ parentMenuRef }) {
  const { copiedElementType, selectedElement } = useStory(({ state }) => ({
    copiedElementType: state.copiedElementState.type,
    selectedElement: state.selectedElements?.[0],
  }));
  const { handleCopyStyles, handlePasteStyles } = useCopyPasteActions();
  const {
    handleDuplicateSelectedElements,
    handleOpenScaleAndCrop,
    handleSetPageBackground,
  } = useElementActions();
  const {
    canElementMoveBackwards,
    canElementMoveForwards,
    handleSendBackward,
    handleSendToBack,
    handleBringForward,
    handleBringToFront,
  } = useLayerActions();

  const canTranscodeResource = useLocalMedia(
    (value) => value.state.canTranscodeResource
  );
  const { hasTrimMode, toggleTrimMode } = useVideoTrim(
    ({ state, actions }) => ({
      hasTrimMode: state.hasTrimMode,
      toggleTrimMode: actions.toggleTrimMode,
    })
  );

  const subMenuRef = useRef();
  const { menuPosition, onCloseMenu } = useRightClickMenu();
  const layerSelectProps = useLayerSelect({
    menuPosition,
    isMenuOpen: true,
  });

  const { closeSubMenu, isSubMenuOpen, subMenuItems, ...subMenuTriggerProps } =
    layerSelectProps || {};

  const isVideo = selectedElement?.type === 'video';
  const scaleLabel = isVideo
    ? RIGHT_CLICK_MENU_LABELS.SCALE_AND_CROP_VIDEO
    : RIGHT_CLICK_MENU_LABELS.SCALE_AND_CROP_IMAGE;
  const copyLabel = isVideo
    ? RIGHT_CLICK_MENU_LABELS.COPY_VIDEO_STYLES
    : RIGHT_CLICK_MENU_LABELS.COPY_IMAGE_STYLES;
  const pasteLabel = isVideo
    ? RIGHT_CLICK_MENU_LABELS.PASTE_VIDEO_STYLES
    : RIGHT_CLICK_MENU_LABELS.PASTE_IMAGE_STYLES;

  const showToggleTrimMode = isVideo && hasTrimMode;

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
      <LayerUngroup />

      <ContextMenuComponents.MenuSeparator />

      <ContextMenuComponents.MenuButton onClick={handleSetPageBackground}>
        {RIGHT_CLICK_MENU_LABELS.SET_AS_PAGE_BACKGROUND}
      </ContextMenuComponents.MenuButton>
      <ContextMenuComponents.MenuButton onClick={handleOpenScaleAndCrop}>
        {scaleLabel}
      </ContextMenuComponents.MenuButton>
      {showToggleTrimMode && (
        <ContextMenuComponents.MenuButton
          disabled={!canTranscodeResource(selectedElement?.resource)}
          onClick={toggleTrimMode}
        >
          {RIGHT_CLICK_MENU_LABELS.TRIM_VIDEO}
        </ContextMenuComponents.MenuButton>
      )}

      <ContextMenuComponents.MenuButton onClick={handleCopyStyles}>
        {copyLabel}
        <ContextMenuComponents.MenuShortcut>
          {RIGHT_CLICK_MENU_SHORTCUTS.COPY_STYLES.display}
        </ContextMenuComponents.MenuShortcut>
      </ContextMenuComponents.MenuButton>
      <ContextMenuComponents.MenuButton
        disabled={copiedElementType !== selectedElement?.type}
        onClick={handlePasteStyles}
      >
        {pasteLabel}
        <ContextMenuComponents.MenuShortcut>
          {RIGHT_CLICK_MENU_SHORTCUTS.PASTE_STYLES.display}
        </ContextMenuComponents.MenuShortcut>
      </ContextMenuComponents.MenuButton>
    </>
  );
}
ForegroundMediaMenu.propTypes = MenuPropType;

export default ForegroundMediaMenu;
