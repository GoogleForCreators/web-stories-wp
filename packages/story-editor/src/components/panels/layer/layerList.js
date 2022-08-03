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
import PropTypes from 'prop-types';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { Reorderable } from '../../reorderable';
import { useRightClickMenu } from '../../../app';
import { LAYER_HEIGHT } from './constants';
import ReorderableElement from './reorderableElement';
import useLayerElements from './useLayerElements';

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

function LayerPanel({ layers }) {
  const onOpenMenu = useRightClickMenu((value) => value.onOpenMenu);

  // This is a list of layers and groups in the order they're displayed
  const { layerElements, handlePositionChange } = useLayerElements(layers);

  if (layers.length === 0) {
    return null;
  }

  return (
    <LayerList
      onContextMenu={onOpenMenu}
      onPositionChange={handlePositionChange}
      mode={'vertical'}
      getItemSize={() => LAYER_HEIGHT}
    >
      {layerElements.map((element) => (
        <ReorderableElement key={element.id} {...element} />
      ))}
    </LayerList>
  );
}

LayerPanel.propTypes = {
  layers: PropTypes.array.isRequired,
};

export default LayerPanel;
