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

const textCss = ({ isBold, size, theme }) => css`
  ${defaultTypographyStyle};
  ${themeHelpers.expandPresetStyles({
    preset: theme.typography.presets.paragraph[size],
    theme,
  })};
  font-weight: ${isBold
    ? theme.typography.weight.bold
    : theme.typography.presets.paragraph[size].weight};
`;

const labelTextCss = ({ isBold, size, theme }) => css`
  ${defaultTypographyStyle};
  ${themeHelpers.expandPresetStyles({
    preset: theme.typography.presets.label[size],
    theme,
  })};
  font-weight: ${isBold
    ? theme.typography.weight.bold
    : theme.typography.presets.label[size].weight};
`;

const Paragraph = styled.p`
  ${textCss};
`;

const Span = styled.span`
  ${textCss};
`;

const Kbd = styled.kbd`
  ${textCss};
  background-color: transparent;
  white-space: nowrap;
`;

const Label = styled.label`
  ${labelTextCss};

  color: ${({ disabled, theme }) =>
    disabled ? theme.colors.fg.disable : 'auto'};
`;

export const Text = ({ as, disabled, ...props }) => {
  switch (as) {
    case 'label':
      /* eslint-disable-next-line styled-components-a11y/label-has-associated-control --
       * This is building block in the design system that is used with inputs
       * and therefore has no associated control in the text element itself since it is unassembled.
       **/
      return <Label disabled={disabled} {...props} />;
    case 'span':
      return <Span {...props} />;
    case 'kbd':
      return <Kbd {...props} />;
    default:
      return <Paragraph {...props} />;
  }
};

Text.propTypes = {
  as: PropTypes.oneOf(['p', 'span', 'label', 'kbd']),
  /** only applies to label styling */
  disabled: PropTypes.bool,
  isBold: PropTypes.bool,
  size: PropTypes.oneOf(THEME_CONSTANTS.TYPOGRAPHY.TEXT_SIZES),
};
Text.defaultProps = {
  as: 'p',
  isBold: false,
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.MEDIUM,
};
