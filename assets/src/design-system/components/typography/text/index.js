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
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { THEME_CONSTANTS, themeHelpers } from '../../../theme';
import { defaultTypographyStyle } from '../styles';

export const Text = styled.p`
  ${defaultTypographyStyle}
  ${({ as, isBold, size, theme }) => {
    const asLink =
      as === 'a' &&
      css`
        color: ${theme.colors.fg.linkNormal};
        text-decoration: none;
        cursor: pointer;
        &:hover {
          color: ${theme.colors.fg.linkHover};
        }
      `;
    return css`
      ${themeHelpers.expandPresetStyles({
        preset: theme.typography.presets.text[size],
        theme,
      })};
      font-weight: ${isBold
        ? theme.typography.weight.bold
        : theme.typography.presets.text[size].weight};
      ${asLink};
    `;
  }}
`;

Text.propTypes = {
  as: PropTypes.oneOf(['p', 'a', 'span']),
  isBold: PropTypes.bool,
  size: PropTypes.oneOf(THEME_CONSTANTS.TEXT_SIZES),
};
Text.defaultProps = {
  as: 'p',
  isBold: false,
  size: THEME_CONSTANTS.TYPOGRAPHY_PRESET_SIZES.MEDIUM,
};
