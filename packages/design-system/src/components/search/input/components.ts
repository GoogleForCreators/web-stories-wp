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
import {
  ChevronDownSmall,
  CrossSmall as Clear,
  Magnifier as Search,
} from '../../../icons';
import { themeHelpers, TextSize } from '../../../theme';
import { Z_INDEX } from '../constants';

export const InputContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    position: relative;
    height: 36px;
    width: 100%;
    max-width: 400px;
    background-color: transparent;
    color: ${theme.colors.fg.primary};
  `
);

export const Input = styled.input<{ hasError?: boolean }>(
  ({ theme, hasError }) => css`
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: transparent;
    outline: none;
    cursor: pointer;
    ${themeHelpers.expandPresetStyles({
      preset: theme.typography.presets.paragraph[TextSize.Small],
      theme,
    })};
    color: ${theme.colors.fg.primary};
    border: 1px solid ${theme.colors.border.defaultNormal};
    padding: 8px 20px 8px 40px;
    &::placeholder {
      color: ${theme.colors.fg.tertiary};
    }
    &[aria-expanded='true'] {
      border-color: ${theme.colors.border.defaultActive};
    }

    border-radius: ${theme.borders.radius.small};

    &::-ms-clear {
      display: none;
    }

    &::-webkit-search-decoration,
    &::-webkit-search-cancel-button,
    &::-webkit-search-results-button,
    &::-webkit-search-results-decoration {
      appearance: none;
    }

    &:hover {
      border-color: ${theme.colors.border.defaultHover};
    }

    ${themeHelpers.focusableOutlineCSS(theme.colors.border.focus)};

    ${hasError &&
    css`
      border-color: ${theme.colors.interactiveBg.negativeHover};

      &:active,
      &:hover {
        border-color: ${theme.colors.interactiveBg.negativeHover};
      }
    `}

    &:disabled {
      pointer-events: none;
      border-color: ${theme.colors.border.disable};
      color: ${theme.colors.fg.disable};

      &:hover {
        border-color: ${theme.colors.border.disable};
      }
    }
  `
);

const BaseDecorationContainer = css`
  display: flex;
  align-items: center;
  width: 32px;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.fg.secondary};
  border: 0;
  margin: auto 1px auto auto;
  padding: 0;
  align-self: flex-end;
  cursor: pointer;
`;

export const ClearButton = styled.button<{ isVisible?: boolean }>`
  ${BaseDecorationContainer};
  display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')};
  outline: none;
  ${({ theme }) => themeHelpers.focusableOutlineCSS(theme.colors.border.focus)};
  height: 30px;
  z-index: ${Z_INDEX.CLEAR_BUTTON};
`;

export const ClearIcon = styled(Clear)`
  width: 32px;
  height: auto;
  margin: auto;
`;

export const ChevronDecoration = styled.div<{
  isVisible?: boolean;
  disabled?: boolean;
}>`
  ${BaseDecorationContainer};
  display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')};
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'collapsed')};
  height: 100%;
  ${({ disabled, theme }) =>
    disabled &&
    css`
      pointer-events: none;
      color: ${theme.colors.fg.disable};
    `}
`;

export const ChevronIcon = styled(ChevronDownSmall)<{ $isMenuOpen?: boolean }>`
  width: 32px;
  height: auto;
  margin: auto;

  ${({ $isMenuOpen }) =>
    $isMenuOpen &&
    css`
      transform: rotate(180deg);
    `}
`;

export const SearchDecoration = styled.div<{
  disabled?: boolean;
  activeSearch?: boolean;
}>(
  ({ theme, activeSearch, disabled }) => css`
    ${BaseDecorationContainer};
    position: absolute;
    height: 100%;
    margin: 0;
    left: 8px;
    color: ${activeSearch ? theme.colors.fg.tertiary : theme.colors.fg.primary};
    pointer-events: none;

    ${disabled &&
    css`
      color: ${theme.colors.fg.disable};
    `}
  `
);

export const SearchIcon = styled(Search)`
  position: relative;
  width: 32px;
  height: auto;
  margin: auto;
`;
