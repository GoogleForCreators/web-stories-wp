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
/**
 * Internal dependencies
 */
import { themeHelpers, THEME_CONSTANTS } from '../../theme';
import { defaultTypographyStyle } from '../typography/styles';
import { BUTTON_TYPES } from './constants';
import { Button } from './button';

const ButtonAsLink = styled(Button).attrs({
  type: BUTTON_TYPES.PLAIN,
})`
  ${defaultTypographyStyle};
  ${({ theme, size }) => css`
    ${themeHelpers.expandPresetStyles({
      preset: theme.typography.presets.link[size],
      theme,
    })};

    color: ${theme.colors.fg.linkNormal};

    :hover {
      color: ${theme.colors.fg.linkHover};
    }
    &:active,
    &:disabled {
      background-color: ${theme.colors.opacity.footprint};
    }
  `}
  ${themeHelpers.focusableOutlineCSS}
`;

ButtonAsLink.defaultProps = {
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.MEDIUM,
};

export { ButtonAsLink };
