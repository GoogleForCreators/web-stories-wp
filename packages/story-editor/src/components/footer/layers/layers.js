/*
 * Copyright 2021 Google LLC
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
import { useState } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import {
  Icons,
  Text,
  NotificationBubble,
  THEME_CONSTANTS,
  BUBBLE_VARIANTS,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import styled, { css } from 'styled-components';
import { LayerPanel } from '../../panels/design';
import useLayers from '../../panels/design/layer/useLayers';
import Popup from '../../secondaryPopup';

const Container = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 300px;
  border-radius: ${({ theme }) => theme.borders.radius.small};
  background-color: ${({ theme }) => theme.colors.bg.secondary};
  overflow: auto;
`;

export const LabelText = styled(Text)`
  color: ${({ theme }) => theme.colors.fg.primary};
  padding-right: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: hidden;
`;

const Button = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.border.defaultNormal};
  background-color: ${({ theme }) => theme.colors.opacity.footprint};
  border-radius: ${({ theme }) => theme.borders.radius.small};
  padding: 5px 8px;
  cursor: pointer;
  display: flex;
`;

export const ChevronWrap = styled.div(
  ({ theme, isOpen }) => css`
    color: ${theme.colors.fg.primary};
    width: 32px;
    height: 32px;
    margin: -4px;

    ${isOpen &&
    css`
      transform: rotate(180deg);
    `}
  `
);

function Layers() {
  const layers = useLayers();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Popup isOpen={isOpen} anchor="right" zIndex={9999}>
        <Container>
          <LayerPanel />
        </Container>
      </Popup>
      <Button
        aria-haspopup
        aria-label={__('Layers', 'web-stories')}
        onClick={() => setIsOpen((state) => !state)}
      >
        <LabelText size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {__('Layers', 'web-stories')}
        </LabelText>
        <NotificationBubble
          data-testid="panel-badge"
          notificationCount={layers?.length}
          variant={BUBBLE_VARIANTS.SECONDARY}
          aria-hidden
        />
        <ChevronWrap isOpen={isOpen}>
          <Icons.ChevronDownSmall />
        </ChevronWrap>
      </Button>
    </>
  );
}

export default Layers;
