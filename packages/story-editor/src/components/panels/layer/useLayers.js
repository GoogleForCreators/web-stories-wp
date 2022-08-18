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

function useLayers() {
  const { elements, arrangeElement, arrangeGroup } = useStory(
    ({ state, actions }) => ({
      elements: state.currentPage?.elements || [],
      arrangeElement: actions.arrangeElement,
      arrangeGroup: actions.arrangeGroup,
    })
  );
  const elementLayers = useMemo(
    () =>
      elements.map(({ id, groupId, layerName }, position) => ({
        id,
        groupId,
        layerName,
        position,
      })),
    [elements]
  );
  elementLayers.reverse();

  // This is a list of elements and groups in the order they're displayed
  const layers = useMemo(() => {
    const groupIds = new Set();
    return (
      elementLayers
        // If an element has a new group, add both group and element
        .map((element, index, list) => {
          const elementLayer = {
            isGroup: false,
            isFirstElementAfterGroup:
              index > 0 && Boolean(list[index - 1].groupId),
            id: element.id,
            position: element.position,
          };
          const isGroup = element.groupId && !groupIds.has(element.groupId);
          if (!isGroup) {
            return elementLayer;
          }
          groupIds.add(element.groupId);
          const groupLayer = {
            isGroup: true,
            id: element.groupId,
            position: element.position,
            name: element.groupId,
          };
          return [groupLayer, elementLayer];
        })
        // Flatten the nested arrays
        .flat()
    );
  }, [elementLayers]);

  const handlePositionChange = useCallback(
    (oldPosObj, newPosObj, evt) => {
      const { position: oldPos } = oldPosObj;
      const {
        position: newPos,
        data: { groupId: newGroupId },
      } = newPosObj;
      const offsetTopHalf = nestedOffsetCalcFunc(evt); // Only relevant if isNewPosLastInGroup
      const oldPosElement = elementLayers.find((e) => e.position === oldPos);
      const elementAboveNewPos = elementLayers.find(
        (e) => e.position === (newPos <= 2 ? 1 : newPos + 1)
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
    [arrangeElement, arrangeGroup, elementLayers]
  );

  return { layers, handlePositionChange };
}

export default useLayers;
