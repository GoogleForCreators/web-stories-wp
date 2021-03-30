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

/**
 * Internal dependencies
 */
import { THEME_CONSTANTS, themeHelpers } from '../../../theme';
import { defaultTypographyStyle } from '../styles';

export const Link = styled.a`
  ${({ size, theme }) => css`
    ${defaultTypographyStyle};
    ${themeHelpers.expandPresetStyles({
      preset: theme.typography.presets.link[size],
      theme,
    })};

    color: ${theme.colors.fg.linkNormal};
    text-decoration: none;
    cursor: pointer;

    :hover {
      color: ${theme.colors.fg.linkHover};
    }
    :focus {
      /* Override WordPress's common css */
      color: ${theme.colors.fg.linkNormal} !important;
    }

    :focus {
      color: ${theme.colors.fg.linkNormal};
    }

    ${themeHelpers.focusableOutlineCSS(theme.colors.border.focus)}
  `};
`;

Link.propTypes = {
  size: PropTypes.oneOf(THEME_CONSTANTS.TYPOGRAPHY.TEXT_SIZES),
};
Link.defaultProps = {
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.MEDIUM,
};
