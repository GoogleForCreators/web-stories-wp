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
import { Fragment, useContext } from 'react';

/**
 * Internal dependencies
 */
import {
  Reorderable,
  ReorderableSeparator,
  ReorderableItem,
} from '../../reorderable';
import { useStory } from '../../../app';
import Layer from './layer';
import { LAYER_HEIGHT } from './constants';
import LayerContext from './context';

const LayerList = styled(Reorderable)`
  flex-direction: column;
  width: 100%;
  align-items: stretch;
`;

const LayerSeparator = styled(ReorderableSeparator)`
  height: ${LAYER_HEIGHT}px;
  margin: -${LAYER_HEIGHT / 2}px 0;
  padding: ${LAYER_HEIGHT / 2}px 0;
`;

function LayerPanel() {
  const {
    state: { layers },
  } = useContext(LayerContext);

  const {
    actions: { arrangeElement, setSelectedElementsById },
  } = useStory();

  const numLayers = layers && layers.length;

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
    >
      {layers.map((layer) => (
        <Fragment key={layer.id}>
          <LayerSeparator position={layer.position + 1} />
          <ReorderableItem
            position={layer.position}
            onStartReordering={() =>
              setSelectedElementsById({ elementIds: [layer.id] })
            }
            disabled={layer.type === 'background'}
          >
            <Layer layer={layer} />
          </ReorderableItem>
        </Fragment>
      ))}
    </LayerList>
  );
}

export default LayerPanel;
