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
import { RIGHT_CLICK_MENU_LABELS } from '../constants';
import { useElementActions } from '../hooks';
import useShapeMaskElements from '../../../utils/useShapeMaskElements';
import { useStory } from '../..';

function MultipleElementsMenu() {
  const {
    handleDuplicateSelectedElements,
    handleGroupSelectedElements,
    handleUngroupSelectedElements,
  } = useElementActions();
  const { canMergeIntoMask, mergeIntoMask } = useShapeMaskElements();
  const { selectedElements } = useStory(({ state }) => ({
    selectedElements: state.selectedElements,
  }));
  const isGroupSelected = selectedElements.some((el) => el.groupId);
  const isOnlyGroupSelected = selectedElements.every(
    (el) => el.groupId && el.groupId === selectedElements[0].groupId
  );

  return (
    <>
      <ContextMenuComponents.MenuButton
        onClick={handleDuplicateSelectedElements}
      >
        {RIGHT_CLICK_MENU_LABELS.DUPLICATE_ELEMENTS(2)}
      </ContextMenuComponents.MenuButton>
      {/* only show if 1 shape and 1 media element is selected */}
      {canMergeIntoMask && (
        <ContextMenuComponents.MenuButton onClick={mergeIntoMask}>
          {RIGHT_CLICK_MENU_LABELS.USE_SHAPE_AS_MASK}
        </ContextMenuComponents.MenuButton>
      )}
      {!isOnlyGroupSelected && (
        <ContextMenuComponents.MenuButton onClick={handleGroupSelectedElements}>
          {RIGHT_CLICK_MENU_LABELS.GROUP_LAYERS}
        </ContextMenuComponents.MenuButton>
      )}
      {isGroupSelected && (
        <ContextMenuComponents.MenuButton
          onClick={handleUngroupSelectedElements}
        >
          {RIGHT_CLICK_MENU_LABELS.UNGROUP_LAYERS}
        </ContextMenuComponents.MenuButton>
      )}
    </>
  );
}

export default MultipleElementsMenu;
