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
import { memo } from '@googleforcreators/react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { PanelContent } from '../../panel';
import useInspector from '../../../inspector/useInspector';
import LayerList from './layerList';
import useLayers from './useLayers';

const HEAD_AREA_HEIGHT = 64;
const LAYERS_HEIGHT_PADDING = 12;

const Container = styled.div`
  filter: drop-shadow(0px -4px 8px rgba(0, 0, 0, 0.2));
  max-height: ${({ maxHeight }) => maxHeight}px;
`;

function LayerPanel() {
  const layers = useLayers();

  const inspectorContentHeight = useInspector(
    ({ state }) => state.inspectorContentHeight
  );

  const maxHeight =
    inspectorContentHeight - HEAD_AREA_HEIGHT - LAYERS_HEIGHT_PADDING;

  return (
    <Container maxHeight={maxHeight}>
      <PanelContent isSecondary padding={'0'}>
        <LayerList layers={layers} />
      </PanelContent>
    </Container>
  );
}

export default memo(LayerPanel);
