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

function TextMenu() {
  const { handleCopyStyles } = useCopyPasteActions();
  const { handleDuplicateSelectedElements } = useElementActions();
  const {
    canElementMoveBackwards,
    canElementMoveForwards,
    handleSendBackward,
    handleSendToBack,
    handleBringForward,
    handleBringToFront,
  } = useLayerActions();
  const { handleAddColorPreset, handleAddTextPreset } = usePresetActions();

  return (
    <>
      {/* TODO: Layer select items */}

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

      <ContextMenuComponents.MenuSeparator />

      <ContextMenuComponents.MenuButton onClick={handleCopyStyles}>
        {RIGHT_CLICK_MENU_LABELS.COPY_STYLES}
        <ContextMenuComponents.MenuShortcut>
          {RIGHT_CLICK_MENU_SHORTCUTS.COPY_STYLES.display}
        </ContextMenuComponents.MenuShortcut>
      </ContextMenuComponents.MenuButton>
      <ContextMenuComponents.MenuButton
        // disabled={copiedElementType !== selectedElement?.type}
        onClick={handleCopyStyles}
      >
        {RIGHT_CLICK_MENU_LABELS.PASTE_STYLES}
        <ContextMenuComponents.MenuShortcut>
          {RIGHT_CLICK_MENU_SHORTCUTS.PASTE_STYLES.display}
        </ContextMenuComponents.MenuShortcut>
      </ContextMenuComponents.MenuButton>
      <ContextMenuComponents.MenuButton onClick={handleAddTextPreset}>
        {RIGHT_CLICK_MENU_LABELS.ADD_TO_TEXT_PRESETS}
      </ContextMenuComponents.MenuButton>
      <ContextMenuComponents.MenuButton onClick={handleAddColorPreset}>
        {RIGHT_CLICK_MENU_LABELS.ADD_TO_COLOR_PRESETS}
      </ContextMenuComponents.MenuButton>
    </>
  );
}

export default TextMenu;
