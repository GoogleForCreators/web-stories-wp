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
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Button,
  Icons,
  Text,
  THEME_CONSTANTS,
  theme,
  lightMode,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { __ } from '@googleforcreators/i18n';
import { CONTEXT_MENU_WIDTH } from '@googleforcreators/design-system/src/components/contextMenu/menu';
import { useDropTargets, useRightClickMenu } from '../../app';
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

function EmptyStateLayer() {
  const { isMenuOpen, onOpenMenu } = useRightClickMenu(
    ({ isMenuOpen, onOpenMenu }) => ({
      isMenuOpen,
      onOpenMenu,
    })
  );
  const { pages } = useStory(({ state: { pages } }) => ({
    pages,
  }));
  const { activeDropTargetId } = useDropTargets(
    ({ state: { activeDropTargetId } }) => ({
      activeDropTargetId,
    })
  );

  if (!isEmptyStory(pages) || activeDropTargetId) {
    return null;
  }

  const onButtonClick = (e) => {
    const bb = e.target.getBoundingClientRect();
    e.clientX = bb.left - CONTEXT_MENU_WIDTH / 2 + bb.width / 2;
    // Hardcoded because it's not trivial to get the menu height here.
    const EMPTY_STATE_CONTEXT_MENU_HEIGHT = 132;
    e.clientY = bb.top - EMPTY_STATE_CONTEXT_MENU_HEIGHT + bb.height;
    onOpenMenu(e);
  };

  return (
    <Layer onContextMenu={onOpenMenu}>
      <DisplayPageArea withSafezone={false}>
        <EmptyStateMessage>
          <Button
            type={BUTTON_TYPES.SECONDARY}
            variant={BUTTON_VARIANTS.CIRCLE}
            onClick={onButtonClick}
            aria-haspopup="true"
            aria-label={__('Add content', 'web-stories')}
            aria-describedby="emptystate-message"
            aria-expanded={isMenuOpen}
          >
            <Icons.Media />
          </Button>
          <ThemeProvider theme={{ ...theme, colors: lightMode }}>
            <Text
              id="emptystate-message"
              size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
            >
              {__(
                'Add an image, video or template to get started',
                'web-stories'
              )}
            </Text>
          </ThemeProvider>
        </EmptyStateMessage>
      </DisplayPageArea>
    </Layer>
  );
}

export default EmptyStateLayer;
