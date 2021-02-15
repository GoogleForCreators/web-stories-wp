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
import {
  ChevronDown as Chevron,
  CrossSmall as Clear,
  Magnifier as Search,
} from '../../../icons';
import { themeHelpers, THEME_CONSTANTS } from '../../../theme';
import { Z_INDEX } from '../constants';

export const InputContainer = styled.div(
  ({ theme, alignCenter }) => css`
    display: flex;
    position: relative;
    box-sizing: border-box;
    height: 36px;
    width: 100%;
    max-width: 276px;
    background-color: ${theme.colors.bg.primary};
    color: ${theme.colors.fg.primary};

    input {
      padding: 8px 20px 8px ${alignCenter ? 'calc(50% - 18px)' : '40px'};
    }
  `
);
InputContainer.propTypes = {
  alignCenter: PropTypes.bool,
  disabled: PropTypes.bool,
};

export const Input = styled.input(
  ({ theme, hasError }) => css`
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: transparent;
    outline: none;
    cursor: pointer;
    ${themeHelpers.expandPresetStyles({
      preset:
        theme.typography.presets.paragraph[
          THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL
        ],
      theme,
    })};
    color: ${theme.colors.fg.primary};
    border: 1px solid ${theme.colors.border.defaultNormal};

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
Input.propTypes = {
  hasError: PropTypes.bool,
};

const BaseDecorationContainer = css`
  display: flex;
  align-items: center;
  width: 32px;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.fg.secondary};
  border: 0;
  margin: auto 0 auto auto;
  padding: 0;
  align-self: flex-end;
  cursor: pointer;
`;

export const ClearButton = styled.button`
  ${BaseDecorationContainer};
  display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')};

  ${({ theme }) => themeHelpers.focusableOutlineCSS(theme.colors.border.focus)};
  height: 32px;
  z-index: ${Z_INDEX.CLEAR_BUTTON};
`;
ClearButton.propTypes = {
  isVisible: PropTypes.bool,
};

export const ClearIcon = styled(Clear)`
  width: 32px;
  height: auto;
  margin: auto;
`;

export const ChevronDecoration = styled.div`
  ${BaseDecorationContainer};
  display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')};
  height: 100%;
  ${({ disabled, theme }) =>
    disabled &&
    css`
      pointer-events: none;
      color: ${theme.colors.fg.disable};
    `}
`;
ChevronDecoration.propTypes = {
  disabled: PropTypes.bool,
  isVisible: PropTypes.bool,
};

export const ChevronIcon = styled(Chevron)`
  width: 32px;
  height: auto;
  margin: auto;

  ${({ isMenuOpen }) =>
    isMenuOpen &&
    css`
      transform: rotate(180deg);
    `}
`;
ChevronIcon.propTypes = {
  isMenuOpen: PropTypes.bool,
};

export const SearchDecoration = styled.div(
  ({ theme, alignCenter, disabled }) => css`
    ${BaseDecorationContainer};
    position: absolute;
    height: 100%;
    margin: 0;
    left: ${alignCenter ? 'calc(50% - 48px)' : '8px'};
    color: ${alignCenter ? theme.colors.fg.tertiary : theme.colors.fg.primary};

    ${disabled &&
    css`
      pointer-events: none;
      color: ${theme.colors.fg.disable};
    `}
  `
);
SearchDecoration.propTypes = {
  alignCenter: PropTypes.bool,
};

export const SearchIcon = styled(Search)`
  position: relative;
  width: 32px;
  height: auto;
  margin: auto;
`;
