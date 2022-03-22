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
import { useRightClickMenu, useStory } from '../../../../app';
import useFocusCanvas from '../../../canvas/useFocusCanvas';
import { LAYER_HEIGHT } from './constants';
import Layer from './layer';

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
  handleStartReordering,
}) {
  const element = useStory(({ state }) =>
    state.currentPage?.elements.find((el) => el.id === id)
  );
  return element ? (
    <Fragment key={id}>
      <LayerSeparator position={position + 1} />
      <ReorderableItem
        position={position}
        onStartReordering={handleStartReordering(id)}
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
  const { arrangeElement, setSelectedElementsById } = useStory(
    ({ actions }) => ({
      arrangeElement: actions.arrangeElement,
      setSelectedElementsById: actions.setSelectedElementsById,
    })
  );

  const onOpenMenu = useRightClickMenu((value) => value.onOpenMenu);

  const numLayers = layers.length;

  const focusCanvas = useFocusCanvas();
  const handleStartReordering = useCallback(
    (id) => () => {
      setSelectedElementsById({ elementIds: [id] });
      focusCanvas();
    },
    [setSelectedElementsById, focusCanvas]
  );

  if (!numLayers) {
    return null;
  }

  return (
    <LayerList
      onContextMenu={onOpenMenu}
      onPositionChange={(oldPos, newPos) =>
        arrangeElement({
          elementId: layers.find((layer) => layer.position === oldPos).id,
          position: newPos,
        })
      }
      mode={'vertical'}
      getItemSize={() => LAYER_HEIGHT}
    >
      {layers.map((layer) => (
        <ReorderableLayer
          key={layer.id}
          id={layer.id}
          position={layer.position}
          handleStartReordering={handleStartReordering}
        />
      ))}
    </LayerList>
  );
}

LayerPanel.propTypes = {
  layers: PropTypes.array.isRequired,
};

export default LayerPanel;
