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
import {
  Icons,
  Text,
  themeHelpers,
  THEME_CONSTANTS,
  Tooltip,
  TOOLTIP_PLACEMENT,
} from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';
import { useMemo } from '@googleforcreators/react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
/**
 * Internal dependencies
 */
import { Z_INDEX_STORY_DETAILS } from '../../../constants/zIndex';

const Dismiss = styled.button`
  all: unset;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borders.radius.small};
  ${themeHelpers.focusableOutlineCSS};
  width: 22px;
  min-width: 22px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    height: 20px;
    width: 20px;
    margin: auto;
  }
`;

const Token = styled.span`
  ${({ theme }) => css`
    color: ${theme.colors.fg.primary};
    border: 1px solid ${theme.colors.border.defaultNormal};
    border-radius: ${theme.borders.radius.small};
  `}
  position: relative;
  display: flex;
  align-items: center;
  padding: 2px;
  margin: 2px;
  max-width: calc(100% - 4px);
  height: 32px;
`;

const TokenText = styled(Text).attrs({
  forwardedAs: 'span',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  padding-left: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

function Tag({ children, onDismiss }) {
  const id = useMemo(() => uuidv4(), []);
  return (
    <Token data-testid="flat-term-token">
      <TokenText id={id}>{children}</TokenText>
      <Tooltip
        title={__('Remove Tag', 'web-stories')}
        placement={TOOLTIP_PLACEMENT.BOTTOM}
        hasTail
        popupZIndexOverride={Z_INDEX_STORY_DETAILS}
      >
        <Dismiss
          onClick={onDismiss}
          aria-label={__('Remove Tag', 'web-stories')}
          aria-describedby={id}
        >
          <Icons.Cross />
        </Dismiss>
      </Tooltip>
    </Token>
  );
}

Tag.propTypes = {
  children: PropTypes.node.isRequired,
  onDismiss: PropTypes.func.isRequired,
};

export default Tag;
