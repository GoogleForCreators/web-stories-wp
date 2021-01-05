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
import { Fragment, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
  Reorderable,
  ReorderableSeparator,
  ReorderableItem,
} from '../../../reorderable';
import { useStory } from '../../../../app';
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
  overflow-y: scroll;
`;

const LayerSeparator = styled(ReorderableSeparator)`
  height: ${LAYER_HEIGHT}px;
  margin: -${LAYER_HEIGHT / 2}px 0;
  padding: ${LAYER_HEIGHT / 2}px 0;
`;

function LayerPanel({ layers }) {
  const { arrangeElement, setSelectedElementsById } = useStory((state) => ({
    arrangeElement: state.actions.arrangeElement,
    setSelectedElementsById: state.actions.setSelectedElementsById,
  }));

  const numLayers = layers && layers.length;

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
        <Fragment key={layer.id}>
          <LayerSeparator position={layer.position + 1} />
          <ReorderableItem
            position={layer.position}
            onStartReordering={handleStartReordering(layer.id)}
            disabled={layer.isBackground}
          >
            <Layer layer={layer} />
          </ReorderableItem>
        </Fragment>
      ))}
    </LayerList>
  );
}

LayerPanel.propTypes = {
  layers: PropTypes.array.isRequired,
};

export default LayerPanel;
