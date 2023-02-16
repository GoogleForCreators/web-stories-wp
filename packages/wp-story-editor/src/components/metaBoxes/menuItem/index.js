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
import { __ } from '@googleforcreators/i18n';
import { useCallback } from '@googleforcreators/react';
import { trackEvent } from '@googleforcreators/tracking';
import { Tooltip } from '@googleforcreators/story-editor';
import {
  Button as DesignSystemButton,
  ButtonSize,
  ButtonType,
  ButtonVariant,
  Icons,
  Placement,
  THEME_CONSTANTS,
} from '@googleforcreators/design-system';
import styled, { css } from 'styled-components';

/**
 * Internal dependencies
 */
import useMetaBoxes from '../useMetaBoxes';

const Box = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled(DesignSystemButton)`
  border-width: 1px;
  border-style: solid;
  padding: 0 10px;
  white-space: nowrap;
  height: 36px;
  min-width: 36px;
  /* Handle props-dependent styling in one place */
  ${({ isOpen, theme }) => css`
    color: ${theme.colors.fg.primary};
    border-color: ${isOpen
      ? theme.colors.bg.secondary
      : theme.colors.border.defaultNormal};
    background-color: ${isOpen
      ? theme.colors.bg.secondary
      : theme.colors.bg.primary};
  `}

  /* This should be sufficient to ensure proper spacing of button content */
  > :not(svg):last-child {
    margin-right: 0;
  }

  /*
   Margin is set to -8px to compensate for empty space
   around the actual icon graphic in the svg
  */
  svg {
    height: ${THEME_CONSTANTS.ICON_SIZE}px;
    width: auto;
    margin: -8px;
    display: block;
  }
`;

const Item = styled.div``;

function MenuItem() {
  const { metaBoxesVisible, toggleMetaBoxesVisible, hasMetaBoxes } =
    useMetaBoxes(({ state, actions }) => ({
      hasMetaBoxes: state.hasMetaBoxes,
      metaBoxesVisible: state.metaBoxesVisible,
      toggleMetaBoxesVisible: actions.toggleMetaBoxesVisible,
    }));

  const handleMetaBoxesClick = useCallback(() => {
    toggleMetaBoxesVisible();
    trackEvent('meta_boxes_toggled', {
      status: metaBoxesVisible ? 'visible' : 'hidden',
    });
  }, [metaBoxesVisible, toggleMetaBoxesVisible]);

  if (!hasMetaBoxes) {
    return null;
  }

  return (
    <Item>
      <Box>
        <Tooltip
          title={__('Third-Party Meta Boxes', 'web-stories')}
          placement={Placement.Top}
          hasTail
        >
          <Button
            aria-haspopup
            aria-pressed={metaBoxesVisible}
            aria-expanded={metaBoxesVisible}
            isOpen={metaBoxesVisible}
            type={ButtonType.Tertiary}
            variant={ButtonVariant.Rectangle}
            size={ButtonSize.Medium}
            onClick={handleMetaBoxesClick}
            aria-label={__('Third-Party Meta Boxes', 'web-stories')}
          >
            <Icons.LetterMOutline />
          </Button>
        </Tooltip>
      </Box>
    </Item>
  );
}

export default MenuItem;
