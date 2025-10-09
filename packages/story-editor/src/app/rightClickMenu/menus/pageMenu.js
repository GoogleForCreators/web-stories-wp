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
import useVideoTrim from '../../../components/videoTrim/useVideoTrim';
import { RIGHT_CLICK_MENU_LABELS } from '../constants';
import { useElementActions, usePageActions } from '../hooks';
import { useStory, useLocalMedia } from '../..';
import useRightClickMenu from '../useRightClickMenu';
import useLayerSelect from '../useLayerSelect';
import {
  DEFAULT_DISPLACEMENT,
  MenuPropType,
  SubMenuContainer,
  SUB_MENU_ARIA_LABEL,
} from './shared';

function PageMenu({ parentMenuRef }) {
  const { currentPageIndex, canDeletePage, selectedElement } = useStory(
    ({ state }) => ({
      currentPageIndex: state.currentPageIndex,
      canDeletePage: state.pages.length > 1,
      selectedElement: state.selectedElements?.[0],
    })
  );
  const { handleOpenScaleAndCrop, handleRemovePageBackground } =
    useElementActions();
  const { handleAddPageAtPosition, handleDeletePage, handleDuplicatePage } =
    usePageActions();

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

  const disableBackgroundMediaActions = selectedElement?.isDefaultBackground;
  const isVideo = selectedElement?.type === 'video';
  const detachLabel = isVideo
    ? RIGHT_CLICK_MENU_LABELS.DETACH_VIDEO_FROM_BACKGROUND
    : RIGHT_CLICK_MENU_LABELS.DETACH_IMAGE_FROM_BACKGROUND;
  const scaleLabel = isVideo
    ? RIGHT_CLICK_MENU_LABELS.SCALE_AND_CROP_BACKGROUND_VIDEO
    : RIGHT_CLICK_MENU_LABELS.SCALE_AND_CROP_BACKGROUND_IMAGE;

  const showTrimModeAction = isVideo && hasTrimMode;

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
                // eslint-disable-next-line react-hooks/refs -- FIXME
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
        disabled={disableBackgroundMediaActions}
        onClick={handleRemovePageBackground}
      >
        {detachLabel}
      </ContextMenuComponents.MenuButton>

      <ContextMenuComponents.MenuButton
        disabled={disableBackgroundMediaActions}
        onClick={handleOpenScaleAndCrop}
      >
        {scaleLabel}
      </ContextMenuComponents.MenuButton>

      <ContextMenuComponents.MenuSeparator />

      {showTrimModeAction && (
        <>
          <ContextMenuComponents.MenuButton
            disabled={!canTranscodeResource(selectedElement?.resource)}
            onClick={toggleTrimMode}
          >
            {detachLabel}
          </ContextMenuComponents.MenuButton>
          <ContextMenuComponents.MenuSeparator />
        </>
      )}

      <ContextMenuComponents.MenuButton
        onClick={() => handleAddPageAtPosition(currentPageIndex + 1)}
      >
        {RIGHT_CLICK_MENU_LABELS.ADD_NEW_PAGE_AFTER}
      </ContextMenuComponents.MenuButton>
      <ContextMenuComponents.MenuButton
        onClick={() => handleAddPageAtPosition(currentPageIndex)}
      >
        {RIGHT_CLICK_MENU_LABELS.ADD_NEW_PAGE_BEFORE}
      </ContextMenuComponents.MenuButton>
      <ContextMenuComponents.MenuButton onClick={handleDuplicatePage}>
        {RIGHT_CLICK_MENU_LABELS.DUPLICATE_PAGE}
      </ContextMenuComponents.MenuButton>
      <ContextMenuComponents.MenuButton
        disabled={!canDeletePage}
        onClick={handleDeletePage}
      >
        {RIGHT_CLICK_MENU_LABELS.DELETE_PAGE}
      </ContextMenuComponents.MenuButton>
    </>
  );
}
PageMenu.propTypes = MenuPropType;

export default PageMenu;
