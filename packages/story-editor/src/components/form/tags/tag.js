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
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import {
  Text,
  THEME_CONSTANTS,
  themeHelpers,
  Icons,
} from '@web-stories-wp/design-system';

const Dismiss = styled.button`
  all: unset;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borders.radius.small};
  ${themeHelpers.focusableOutlineCSS};
  width: 32px;
  min-width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    height: 16px;
    width: 16px;
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
  padding: 3px 2px;
  margin: 3px 5px 3px 0;
  max-width: calc(100% - 16px);
`;

const TokenText = styled(Text).attrs({
  forwardedAs: 'span',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  padding-left: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

function Tag({ children, onDismiss }) {
  return (
    <Token>
      <TokenText>{children}</TokenText>
      <Dismiss onClick={onDismiss}>
        <Icons.Cross />
      </Dismiss>
    </Token>
  );
}

Tag.propTypes = {
  children: PropTypes.node.isRequired,
  onDismiss: PropTypes.func.isRequired,
};

export default Tag;
