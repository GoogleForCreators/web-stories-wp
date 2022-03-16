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
import styled from 'styled-components';
import { useState, useRef } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import { PLACEMENT } from '@googleforcreators/design-system';
/**
 * Internal dependencies
 */
import { Z_INDEX_FOOTER } from '../../../constants/zIndex';
import { LayerPanel } from '../../panels/design';
import useLayers from '../../panels/design/layer/useLayers';
import Popup, { NavigationWrapper } from '../../secondaryPopup';
import { ToggleButton } from '../../toggleButton';

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.bg.secondary};
  overflow: auto;
  z-index: ${Z_INDEX_FOOTER};
`;

function Layers() {
  const layersLength = useLayers().length;
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  return (
    <>
      <Popup
        isOpen={isOpen}
        placement={PLACEMENT.RIGHT}
        ariaLabel={__('Layers Panel', 'web-stories')}
      >
        <NavigationWrapper alignRight ref={ref} isOpen={isOpen}>
          <Container>
            <LayerPanel />
          </Container>
        </NavigationWrapper>
      </Popup>
      <ToggleButton
        isOpen={isOpen}
        notificationCount={layersLength}
        copy={__('Layers', 'web-stories')}
        onClick={() => setIsOpen((state) => !state)}
      />
    </>
  );
}

export default Layers;
