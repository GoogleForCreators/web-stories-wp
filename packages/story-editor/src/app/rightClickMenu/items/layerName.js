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
import { useCallback } from '@googleforcreators/react';
import { useFeature } from 'flagged';

/**
 * Internal dependencies
 */
import { RIGHT_CLICK_MENU_LABELS } from '../constants';
import { useStory } from '../..';

function LayerName() {
  const updateSelectedElements = useStory(
    (ctx) => ctx.actions.updateSelectedElements
  );
  const toggleLayerNaming = useCallback(
    () =>
      updateSelectedElements({
        properties: (oldElement) => ({
          ...oldElement,
          isRenamable: true,
        }),
      }),
    [updateSelectedElements]
  );

  const isLayerNamingEnabled = useFeature('layerNaming');

  if (!isLayerNamingEnabled) {
    return null;
  }

  return (
    <>
      <ContextMenuComponents.MenuSeparator />
      <ContextMenuComponents.MenuButton onClick={toggleLayerNaming}>
        {RIGHT_CLICK_MENU_LABELS.RENAME_LAYER}
      </ContextMenuComponents.MenuButton>
    </>
  );
}

export default LayerName;
