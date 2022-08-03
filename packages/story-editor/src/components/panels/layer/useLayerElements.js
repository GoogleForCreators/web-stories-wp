/*
 * Copyright 2020 Google LLC
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
import { useMemo, useCallback } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { nestedOffsetCalcFunc } from './constants';

function useLayerElements(layers) {
  const { arrangeElement, arrangeGroup } = useStory(({ actions }) => ({
    arrangeElement: actions.arrangeElement,
    arrangeGroup: actions.arrangeGroup,
    setSelectedElementsById: actions.setSelectedElementsById,
  }));

  // This is a list of layers and groups in the order they're displaye
  const layerElements = useMemo(() => {
    const groupIds = new Set();
    return (
      layers
        // If a layer has a new group, add both group and layer
        .map((layer, index, list) => {
          const displayLayer = {
            isGroup: false,
            isFirstLayerAfterGroup:
              index > 0 && Boolean(list[index - 1].groupId),
            id: layer.id,
            position: layer.position,
          };
          const isGroup = layer.groupId && !groupIds.has(layer.groupId);
          if (!isGroup) {
            return displayLayer;
          }
          groupIds.add(layer.groupId);
          const displayGroup = {
            isGroup: true,
            id: layer.groupId,
            position: layer.position,
            name: layer.groupId,
          };
          return [displayGroup, displayLayer];
        })
        // Flatten the nested arrays
        .flat()
    );
  }, [layers]);

  const handlePositionChange = useCallback(
    (oldPosObj, newPosObj, evt) => {
      const { position: oldPos } = oldPosObj;
      const {
        position: newPos,
        data: { groupId: newGroupId },
      } = newPosObj;
      const offsetTopHalf = nestedOffsetCalcFunc(evt); // Only relevant if isNewPosLastInGroup
      const oldPosElement = layers.find((layer) => layer.position === oldPos);
      const elementAboveNewPos = layers.find(
        (layer) => layer.position === (newPos <= 2 ? 1 : newPos + 1)
      ); // Above in LP is below in array.

      let groupId = newGroupId;
      if (offsetTopHalf && elementAboveNewPos?.groupId) {
        groupId = elementAboveNewPos.groupId;
      }

      if (oldPosObj.data?.group) {
        // We are holding the whole group.
        if (!newPosObj.data?.groupId) {
          arrangeGroup({
            groupId: oldPosObj.data.group,
            position: newPos,
          });
        }
      } else {
        arrangeElement({
          elementId: oldPosElement.id,
          position: newPos,
          groupId,
        });
      }
    },
    [arrangeElement, arrangeGroup, layers]
  );

  return { layerElements, handlePositionChange };
}

export default useLayerElements;
