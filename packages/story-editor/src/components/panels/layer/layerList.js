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
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { Reorderable } from '../../reorderable';
import { useRightClickMenu } from '../../../app';
import { LAYER_HEIGHT } from './constants';
import ReorderableLayer from './reorderableLayer';
import useLayers from './useLayers';

const ReorderableLayerList = styled(Reorderable).attrs({
  'aria-orientation': 'vertical',
  'aria-label': __('Layers List', 'web-stories'),
})`
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: stretch;
  user-select: ${({ hasUserSelect }) => (hasUserSelect ? 'none' : 'initial')};
  overflow-y: auto;
  padding-bottom: 4px; /* for when panel has scroll */
`;

function LayerList() {
  const onOpenMenu = useRightClickMenu((value) => value.onOpenMenu);

  // This is a list of elements and groups in the order they're displayed
  const { layers, handleDragPosition } = useLayers();

  if (layers.length === 0) {
    return null;
  }

  return (
    <ReorderableLayerList
      onContextMenu={onOpenMenu}
      onPositionChange={handleDragPosition}
      mode={'vertical'}
      getItemSize={() => LAYER_HEIGHT}
    >
      {layers.map((layer) => (
        <ReorderableLayer key={layer.id} {...layer} />
      ))}
    </ReorderableLayerList>
  );
}

export default LayerList;
