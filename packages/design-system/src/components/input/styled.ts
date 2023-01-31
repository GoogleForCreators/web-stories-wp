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
import styled, { css } from 'styled-components';

/**
 * Internal dependencies
 */
import { Text } from '../typography';
import { themeHelpers, TextSize } from '../../theme';

export const Container = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  min-width: 40px;
`;

export const Label = styled(Text.Label)`
  margin-bottom: 12px;
  display: inline-block;
`;

export const Hint = styled(Text.Paragraph)<{ hasError?: boolean }>`
  display: inline-block;
  margin-top: 12px;
  color: ${({ hasError, theme }) =>
    theme.colors.fg[hasError ? 'negative' : 'tertiary']};
`;

export const Suffix = styled(Text.Span)`
  background: transparent;
  color: ${({ theme }) => theme.colors.fg.tertiary};
  white-space: nowrap;

  svg {
    width: 32px;
    height: 32px;
    margin: 2px -10px;
    display: block;
  }
`;

export const BaseInput = styled.input<{ hasSuffix: boolean }>(
  ({ hasSuffix, theme }) => css`
    height: 100%;
    width: 100%;
    padding: 0;
    ${hasSuffix &&
    css`
      padding-right: 8px;
    `}
    background-color: inherit;
    border: none;
    outline: none;
    box-shadow: none;
    color: ${theme.colors.fg.primary};

    ${themeHelpers.expandPresetStyles({
      preset: {
        ...theme.typography.presets.paragraph[TextSize.Small],
      },
      theme,
    })};

    ::placeholder {
      color: ${theme.colors.fg.tertiary};
    }

    :disabled {
      color: ${theme.colors.fg.disable};
      border-color: ${theme.colors.border.disable};

      & ~ ${Suffix} {
        color: ${theme.colors.fg.disable};
      }
    }
    :focus {
      box-shadow: none;
    }
    :active:enabled {
      color: ${theme.colors.fg.primary};
    }
  `
);
