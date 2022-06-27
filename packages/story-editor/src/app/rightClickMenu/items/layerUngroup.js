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

function LayerUngroup() {
  const { updateSelectedElements, selectedElements, arrangeElement, elements } =
    useStory(({ state, actions }) => ({
      updateSelectedElements: actions.updateSelectedElements,
      selectedElements: state.selectedElements,
      arrangeElement: actions.arrangeElement,
      elements: state.currentPage?.elements || [],
    }));
  const handleLayerUngroup = useCallback(() => {
    updateSelectedElements({
      properties: (oldElement) => ({
        ...oldElement,
        groupId: null,
      }),
    });

    const oldElement = selectedElements[0];
    let count = 0;
    let currentPosition = 0;

    for (const [index] of Object.entries(elements).reverse()) {
      if (elements[index].id === oldElement.id) {
        currentPosition = Number(index);
      }

      if (
        elements[index].groupId === oldElement.groupId &&
        elements[index].id != oldElement.id &&
        currentPosition === 0
      ) {
        count++;
      }
    }

    arrangeElement({
      elementId: selectedElements[0].id,
      position: currentPosition + count,
    });
  }, [updateSelectedElements, arrangeElement, elements, selectedElements]);

  const isLayerGroupingEnabled = useFeature('layerGrouping');
  const isLayerInGroup = selectedElements.some((el) => el.groupId);

  if (!isLayerGroupingEnabled || !isLayerInGroup) {
    return null;
  }

  return (
    <ContextMenuComponents.MenuButton onClick={handleLayerUngroup}>
      {RIGHT_CLICK_MENU_LABELS.UNGROUP_LAYER}
    </ContextMenuComponents.MenuButton>
  );
}

export default LayerUngroup;
