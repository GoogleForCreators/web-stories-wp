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

function MultipleElementsMenu() {
  const { handleDuplicateSelectedElements, handleUseShapeAsMask } = useElementActions();

  return (
    <>
      <ContextMenuComponents.MenuButton onClick={handleDuplicateSelectedElements}>
        {RIGHT_CLICK_MENU_LABELS.DUPLICATE_ELEMENTS(2)}
      </ContextMenuComponents.MenuButton>

      { // @todo disable menu item if the right type of elements not selected}
        <ContextMenuComponents.MenuButton
          onClick={handleUseShapeAsMask}
        >
          {RIGHT_CLICK_MENU_LABELS.USE_SHAPE_AS_MASK}
        </ContextMenuComponents.MenuButton>
    </>


  );
}

export default MultipleElementsMenu;
