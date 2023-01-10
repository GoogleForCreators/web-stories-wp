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
import type { Element } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { LayerDirection } from '../../../constants';

function getLayerArrangementProps(
  key: string,
  shift: boolean,
  selectedElements: Element[],
  elements: Element[]
) {
  // This only supports moving single layer.
  if (!selectedElements || selectedElements.length > 1) {
    return {};
  }
  let position = null;
  if (key === 'ArrowUp') {
    position = shift ? LayerDirection.Front : LayerDirection.Forward;
  }
  if (key === 'ArrowDown') {
    position = shift ? LayerDirection.Back : LayerDirection.Backward;
  }
  if (!position) {
    return {};
  }

  const { id, groupId } = selectedElements[0];
  // Get layer index.
  const currentPosition = elements.findIndex(({ id: elId }) => elId === id);

  // If the layer is in a group, check if it's first or last of the group,
  // in this case we should just move it out of the group.
  if (groupId) {
    const isLastInGroup = elements[currentPosition - 1]?.groupId !== groupId;
    const isFirstInGroup = elements[currentPosition + 1]?.groupId !== groupId;
    if (
      (isLastInGroup && position === LayerDirection.Backward) ||
      (isFirstInGroup && position === LayerDirection.Forward)
    ) {
      return {
        position: currentPosition,
        groupId: null,
      };
    }
  } else {
    // If the element has a group below, just add it to the group.
    if (
      elements[currentPosition - 1]?.groupId &&
      position === LayerDirection.Backward
    ) {
      return {
        position: currentPosition,
        groupId: elements[currentPosition - 1].groupId,
      };
    }
    // If the element has a group above, just add it to the group.
    if (
      elements[currentPosition + 1]?.groupId &&
      position === LayerDirection.Forward
    ) {
      return {
        position: currentPosition,
        groupId: elements[currentPosition + 1].groupId,
      };
    }
  }

  // Otherwise let's just change the position.
  return { position };
}

export default getLayerArrangementProps;
