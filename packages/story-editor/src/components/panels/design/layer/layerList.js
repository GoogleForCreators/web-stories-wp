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
import styled from 'styled-components';
import { Fragment, useCallback, memo } from '@googleforcreators/react';
import PropTypes from 'prop-types';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import {
  Reorderable,
  ReorderableSeparator,
  ReorderableItem,
} from '../../../reorderable';
import { useRightClickMenu, useStory, useCanvas } from '../../../../app';
import useFocusCanvas from '../../../canvas/useFocusCanvas';
import { LAYER_HEIGHT } from './constants';
import Layer from './layer';
import ReorderableGroup from './reorderableGroup';

const LayerList = styled(Reorderable).attrs({
  'aria-orientation': 'vertical',
  'aria-label': __('Layers List', 'web-stories'),
})`
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: stretch;
  user-select: ${({ hasUserSelect }) => (hasUserSelect ? 'none' : 'initial')};
  overflow-y: auto;
  padding-bottom: 4px; // for when panel has scroll
`;

const LayerSeparator = styled(ReorderableSeparator)`
  height: ${LAYER_HEIGHT}px;
  margin: -${LAYER_HEIGHT / 2}px 0;
  padding: ${LAYER_HEIGHT / 2}px 0;
`;

const ReorderableLayer = memo(function ReorderableLayer({
  id,
  position,
  nestedOffset,
  nestedOffsetCalcFunc,
  handleStartReordering,
}) {
  const element = useStory(({ state }) =>
    state.currentPage?.elements.find((el) => el.id === id)
  );
  return element ? (
    <Fragment key={id}>
      <LayerSeparator
        groupId={element.groupId}
        nestedOffset={nestedOffset}
        nestedOffsetCalcFunc={nestedOffsetCalcFunc}
        position={position + 1}
        isNested={element.groupId}
      />
      <ReorderableItem
        position={position}
        onStartReordering={handleStartReordering(element)}
        disabled={element.isBackground}
      >
        <Layer element={element} />
      </ReorderableItem>
    </Fragment>
  ) : null;
});

ReorderableLayer.propTypes = {
  id: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  handleStartReordering: PropTypes.func.isRequired,
};

function LayerPanel({ layers }) {
  const { arrangeElement, arrangeGroup, setSelectedElementsById } = useStory(
    ({ actions }) => ({
      arrangeElement: actions.arrangeElement,
      arrangeGroup: actions.arrangeGroup,
      setSelectedElementsById: actions.setSelectedElementsById,
    })
  );

  const onOpenMenu = useRightClickMenu((value) => value.onOpenMenu);

  const numLayers = layers.length;

  const focusCanvas = useFocusCanvas();
  const { renamableLayer } = useCanvas(({ state }) => ({
    renamableLayer: state.renamableLayer,
  }));

  const handleStartReordering = useCallback(
    (element) => () => {
      setSelectedElementsById({ elementIds: [element.id] });

      if (renamableLayer) {
        focusCanvas();
      }
    },
    [setSelectedElementsById, focusCanvas, renamableLayer]
  );

  if (!numLayers) {
    return null;
  }

  const layersWithGroups = [];
  const alreadyAddedGroupIds = [];
  for (const layer of layers) {
    if (layer.groupId && !alreadyAddedGroupIds.includes(layer.groupId)) {
      const group = {
        groupId: layer.groupId,
        position: layer.position,
        name: layer.groupId,
      };
      layersWithGroups.push({ group });
      alreadyAddedGroupIds.push(group.groupId);
    }
    layersWithGroups.push({ layer });
  }

  // Upper half will move the layer inside the group, lower - outside.
  const nestedOffsetCalcFunc = (evt) => evt.offsetY < LAYER_HEIGHT / 1.7;

  const handlePositionChange = (oldPosObj, newPosObj, evt) => {
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
  };

  return (
    <LayerList
      onContextMenu={onOpenMenu}
      onPositionChange={handlePositionChange}
      mode={'vertical'}
      getItemSize={() => LAYER_HEIGHT}
    >
      {layersWithGroups.map(({ layer, group }, index) => {
        if (group) {
          return (
            <ReorderableGroup
              key={group.groupId}
              groupId={group.groupId}
              position={group.position}
              name={group.name}
              handleStartReordering={handleStartReordering}
            />
          );
        }
        // We only want to check this drop position offset for the first layer after the group (separator is above the layer).
        const isFirstLayerAfterGroup =
          index > 0 ? layersWithGroups[index - 1].layer?.groupId : false;
        return (
          <ReorderableLayer
            key={layer.id}
            id={layer.id}
            position={layer.position}
            nestedOffset={isFirstLayerAfterGroup}
            nestedOffsetCalcFunc={nestedOffsetCalcFunc}
            handleStartReordering={handleStartReordering}
          />
        );
      })}
    </LayerList>
  );
}

LayerPanel.propTypes = {
  layers: PropTypes.array.isRequired,
};

export default LayerPanel;
