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
import styled, { ThemeProvider } from 'styled-components';
import {
  ButtonType,
  ButtonVariant,
  Button,
  Icons,
  Text,
  TextSize,
  theme,
  lightMode,
  CONTEXT_MENU_MIN_WIDTH,
} from '@googleforcreators/design-system';
import { useTransform } from '@googleforcreators/transform';

/**
 * Internal dependencies
 */
import { __ } from '@googleforcreators/i18n';
import { useConfig, useRightClickMenu } from '../../app';
import useStory from '../../app/story/useStory';
import isEmptyStory from '../../app/story/utils/isEmptyStory';
import { Layer, PageArea } from './layout';

const DisplayPageArea = styled(PageArea)`
  position: absolute;
  z-index: 1;
`;

const EmptyStateMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  text-align: center;
  svg {
    pointer-events: none;
  }
  p {
    margin-top: 14px;
  }
`;

const StyledButton = styled(Button)`
  pointer-events: initial;
`;

function EmptyStateLayer() {
  const { isRTL } = useConfig();
  const { isMenuOpen, onOpenMenu } = useRightClickMenu(
    ({ isMenuOpen, onOpenMenu }) => ({
      isMenuOpen,
      onOpenMenu,
    })
  );
  const { pages } = useStory(({ state: { pages } }) => ({
    pages,
  }));
  const { isAnythingTransforming } = useTransform((state) => ({
    isAnythingTransforming: state.state.isAnythingTransforming,
  }));

  if (!isEmptyStory(pages) || isAnythingTransforming) {
    return null;
  }

  const onButtonClick = (e) => {
    const bb = e.target.getBoundingClientRect();
    e.clientX =
      bb.left - ((isRTL ? -1 : 1) * CONTEXT_MENU_MIN_WIDTH) / 2 + bb.width / 2;
    // Hardcoded because it's not trivial to get the menu height here.
    const EMPTY_STATE_CONTEXT_MENU_HEIGHT = 132;
    e.clientY = bb.top - EMPTY_STATE_CONTEXT_MENU_HEIGHT + bb.height;
    onOpenMenu(e);
  };

  return (
    <Layer
      onContextMenu={onOpenMenu}
      pointerEvents="none"
      aria-label={__('Empty state layer', 'web-stories')}
    >
      <DisplayPageArea withSafezone={false}>
        <EmptyStateMessage>
          <StyledButton
            type={ButtonType.Secondary}
            variant={ButtonVariant.Circle}
            onClick={onButtonClick}
            aria-haspopup="true"
            aria-label={__('Add content', 'web-stories')}
            aria-describedby="emptystate-message"
            aria-expanded={isMenuOpen}
          >
            <Icons.Media />
          </StyledButton>
          <ThemeProvider theme={{ ...theme, colors: lightMode }}>
            <Text.Paragraph id="emptystate-message" size={TextSize.Small}>
              {__(
                'Add an image, video or template to get started',
                'web-stories'
              )}
            </Text.Paragraph>
          </ThemeProvider>
        </EmptyStateMessage>
      </DisplayPageArea>
    </Layer>
  );
}

export default EmptyStateLayer;
