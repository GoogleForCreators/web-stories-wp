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
import { themeHelpers, type Theme, TextSize } from '../../../theme';
import { defaultTypographyStyle } from '../styles';

export interface TextProps {
  size?: TextSize.Large | TextSize.Medium | TextSize.Small | TextSize.XSmall;
  isBold?: boolean;
  disabled?: boolean;
}

interface TextPropsWithTheme extends TextProps {
  theme: Theme;
}

const textCss = ({
  isBold = false,
  size = TextSize.Medium,
  theme,
}: TextPropsWithTheme) => css`
  ${defaultTypographyStyle};
  ${themeHelpers.expandPresetStyles({
    preset: theme.typography.presets.paragraph[size],
    theme,
  })};
  font-weight: ${isBold
    ? theme.typography.weight.bold
    : theme.typography.presets.paragraph[size].weight};
`;

const labelTextCss = ({
  isBold = false,
  size = TextSize.Medium,
  theme,
}: TextPropsWithTheme) => css`
  ${defaultTypographyStyle};
  ${themeHelpers.expandPresetStyles({
    preset: theme.typography.presets.label[size],
    theme,
  })};
  font-weight: ${isBold
    ? theme.typography.weight.bold
    : theme.typography.presets.label[size].weight};
`;

const Paragraph = styled.p<TextProps>`
  ${textCss};
`;

const Span = styled.span<TextProps>`
  ${textCss};
`;

const Kbd = styled.kbd<TextProps>`
  ${textCss};
  background-color: transparent;
  white-space: nowrap;
`;

const Label = styled.label<TextProps>`
  ${labelTextCss};

  color: ${({ disabled, theme }) =>
    disabled ? theme.colors.fg.disable : 'auto'};
`;

export const Text = {
  Label,
  Span,
  Kbd,
  Paragraph,
} as const;
