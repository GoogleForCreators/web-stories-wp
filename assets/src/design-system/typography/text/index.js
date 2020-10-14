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
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { THEME_CONSTANTS } from '../../theme';
import { defaultTypographyStyle } from '../styles';

export const Text = styled.p`
  ${defaultTypographyStyle}
  ${({ as, isBold, size, theme }) => {
    const { text } = theme.typography.presets;
    const asLink = as === 'a' && {
      color: theme.colors.accent.secondary,
      textDecoration: 'none',
      cursor: 'pointer',
    };
    return {
      fontSize: `${text[size].size}px`,
      fontWeight: isBold ? theme.typography.weight.bold : text[size].weight,
      lineHeight: `${text[size].lineHeight}px`,
      letterSpacing: `${text[size].letterSpacing}em`,
      ...asLink,
    };
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
