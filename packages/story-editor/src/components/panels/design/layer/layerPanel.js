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
import { __ } from '@web-stories-wp/i18n';
import { useMemo } from '@web-stories-wp/react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import {
  MAX_HEIGHT_DEFAULT,
  Panel,
  PanelTitle,
  PanelContent,
} from '../../panel';
import LayerList from './layerList';
import useLayers from './useLayers';

const Container = styled.div`
  margin: 0 4px;
  filter: drop-shadow(0px -4px 8px rgba(0, 0, 0, 0.2));
`;

const StyledPanelTitle = styled(PanelTitle)`
  height: 48px;
  border-top-left-radius: ${({ theme }) => theme.borders.radius.small};
  border-top-right-radius: ${({ theme }) => theme.borders.radius.small};
`;

const DividerContainer = styled.div`
  background: ${({ theme }) => theme.colors.bg.tertiary};
`;

const Divider = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider.tertiary};
  margin: 0 16.5px;
`;

function LayerPanel() {
  const layers = useLayers();

  const initialHeight = useMemo(() => Math.round(window.innerHeight / 4), []);

  return (
    <Container>
      <Panel
        name="layer-panel"
        initialHeight={initialHeight}
        resizeable
        ariaHidden
        collapsedByDefault={false}
      >
        <StyledPanelTitle
          isSecondary
          isResizable
          count={layers?.length}
          maxHeight={MAX_HEIGHT_DEFAULT}
        >
          {__('Layers', 'web-stories')}
        </StyledPanelTitle>

        <DividerContainer>
          <Divider />
        </DividerContainer>

        <PanelContent isSecondary padding={'0'}>
          <LayerList layers={layers} />
        </PanelContent>
      </Panel>
    </Container>
  );
}

export default LayerPanel;
