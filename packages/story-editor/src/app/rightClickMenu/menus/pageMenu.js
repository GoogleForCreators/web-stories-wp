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
import { ContextMenuComponents } from '@googleforcreators/design-system';
/**
 * Internal dependencies
 */
import useVideoTrim from '../../../components/videoTrim/useVideoTrim';
import { RIGHT_CLICK_MENU_LABELS } from '../constants';
import { useElementActions, usePageActions } from '../hooks';
import { useStory } from '../../..';
import { useLocalMedia } from '../..';

function ForegroundMediaMenu() {
  const { currentPageIndex, canDeletePage, selectedElement } = useStory(
    ({ state }) => ({
      currentPageIndex: state.currentPageIndex,
      canDeletePage: state.pages.length > 1,
      selectedElement: state.selectedElement,
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
      {/* TODO: Layer select items */}

      <ContextMenuComponents.MenuItem
        disabled={disableBackgroundMediaActions}
        onClick={handleRemovePageBackground}
      >
        {detachLabel}
      </ContextMenuComponents.MenuItem>

      <ContextMenuComponents.MenuItem
        disabled={disableBackgroundMediaActions}
        onClick={handleOpenScaleAndCrop}
      >
        {scaleLabel}
      </ContextMenuComponents.MenuItem>

      <ContextMenuComponents.MenuSeparator />

      {showTrimModeAction && (
        <>
          <ContextMenuComponents.MenuItem
            disabled={!canTranscodeResource(selectedElement?.resource)}
            onClick={toggleTrimMode}
          >
            {detachLabel}
          </ContextMenuComponents.MenuItem>
          <ContextMenuComponents.MenuSeparator />
        </>
      )}

      <ContextMenuComponents.MenuItem
        onClick={() => handleAddPageAtPosition(currentPageIndex + 1)}
      >
        {RIGHT_CLICK_MENU_LABELS.ADD_NEW_PAGE_AFTER}
      </ContextMenuComponents.MenuItem>
      <ContextMenuComponents.MenuItem
        onClick={() => handleAddPageAtPosition(currentPageIndex)}
      >
        {RIGHT_CLICK_MENU_LABELS.ADD_NEW_PAGE_BEFORE}
      </ContextMenuComponents.MenuItem>
      <ContextMenuComponents.MenuItem onClick={handleDuplicatePage}>
        {RIGHT_CLICK_MENU_LABELS.DUPLICATE_PAGE}
      </ContextMenuComponents.MenuItem>
      <ContextMenuComponents.MenuItem
        disabled={!canDeletePage}
        onClick={handleDeletePage}
      >
        {RIGHT_CLICK_MENU_LABELS.DELETE_PAGE}
      </ContextMenuComponents.MenuItem>
    </>
  );
}

export default ForegroundMediaMenu;
