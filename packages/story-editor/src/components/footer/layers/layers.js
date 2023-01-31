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
import { useState, useRef, useEffect } from '@googleforcreators/react';
import { __, sprintf } from '@googleforcreators/i18n';
import { Placement } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { Z_INDEX_FOOTER } from '../../../constants/zIndex';
import { LayerPanel } from '../../panels/layer';
import Popup, { NavigationWrapper } from '../../secondaryPopup';
import { ToggleButton } from '../../toggleButton';
import { useCanvas, useStory } from '../../../app';

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.bg.secondary};
  overflow: auto;
  z-index: ${Z_INDEX_FOOTER};
`;

const StyledNavigationWrapper = styled(NavigationWrapper)`
  width: 260px;
`;

function Layers() {
  const numElements = useStory(
    ({ state }) => state.currentPage?.elements?.length
  );
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();
  const { renamableLayer } = useCanvas(({ state }) => ({
    renamableLayer: state.renamableLayer,
  }));

  useEffect(() => {
    if (renamableLayer) {
      setIsOpen(true);
    }
  }, [renamableLayer]);

  return (
    <>
      <Popup
        isOpen={isOpen}
        placement={Placement.Right}
        ariaLabel={__('Layers Panel', 'web-stories')}
      >
        <StyledNavigationWrapper alignRight ref={ref} isOpen={isOpen}>
          <Container>
            <LayerPanel />
          </Container>
        </StyledNavigationWrapper>
      </Popup>
      <ToggleButton
        hasMenuList
        isOpen={isOpen}
        notificationCount={numElements}
        copy={__('Layers', 'web-stories')}
        onClick={() => setIsOpen((state) => !state)}
        aria-label={sprintf(
          /* translators: %d: number of layers */
          __('Layers (%d)', 'web-stories'),
          numElements
        )}
      />
    </>
  );
}

export default Layers;
