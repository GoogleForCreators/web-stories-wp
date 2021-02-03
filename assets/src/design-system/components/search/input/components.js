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
import { Chevron, Close as Clear, Search } from '../../../icons';
import { themeHelpers } from '../../../theme';

export const InputContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    position: relative;
    box-sizing: border-box;
    height: 36px;
    width: 100%;
    max-width: 276px;
    background-color: ${theme.colors.bg.primary};
    color: ${theme.colors.fg.primary};
  `
);
InputContainer.propTypes = {
  disabled: PropTypes.bool,
};

export const Input = styled.input(
  ({ theme, alignCenter, isOpen, hasError }) => css`
    position: absolute;
    padding: 8px 20px 8px ${alignCenter ? 'calc(50% - 8px)' : '32px'};
    height: 100%;
    width: 100%;
    background-color: transparent;
    outline: none;
    cursor: pointer;
    ${themeHelpers.expandPresetStyles({
      preset: theme.typography.presets.paragraph.small,
      theme,
    })};

    border-radius: ${theme.borders.radius.small};
    border: 1px solid
      ${theme.colors.border[isOpen ? 'defaultActive' : 'defaultNormal']};
    color: ${alignCenter ? theme.colors.fg.tertiary : theme.colors.fg.primary};

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
      border-color: ${theme.colors.border[
        isOpen ? 'defaultActive' : 'defaultHover'
      ]};
    }
    &:focus {
      border-color: ${theme.colors.fg.secondary};
    }

    ${hasError &&
    css`
      ${themeHelpers.focusableOutlineCSS(
        theme.colors.interactiveBg.negativeNormal
      )};
      border-color: ${theme.colors.interactiveBg.negativeNormal};

      &:active,
      &:hover,
      &:focus {
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
  alignCenter: PropTypes.bool,
  hasError: PropTypes.bool,
  isOpen: PropTypes.bool,
};

const BaseDecorationContainer = css`
  display: flex;
  align-items: center;
  width: 16px;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.fg.secondary};
  border: 0;
  margin: auto 12px auto auto;
  padding: 0;
  align-self: flex-end;
  cursor: pointer;
`;

export const ClearButton = styled.button`
  ${BaseDecorationContainer}
  height: 16px;
  z-index: 5;
`;

export const ClearIcon = styled(Clear)`
  width: 8px;
  height: auto;
  margin: auto;
`;

export const ChevronDecoration = styled.div`
  ${BaseDecorationContainer};
  height: 100%;

  ${({ disabled, theme }) =>
    disabled &&
    css`
      pointer-events: none;
      color: ${theme.colors.fg.disable};
    `}
`;
export const ChevronIcon = styled(Chevron)`
  width: 8px;
  height: auto;
  margin: auto;
`;

export const SearchDecoration = styled.div(
  ({ theme, alignCenter, disabled }) => css`
    ${BaseDecorationContainer};
    position: absolute;
    height: 100%;
    margin: 0;
    left: ${alignCenter ? 'calc(50% - 32px)' : '8px'};
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
  width: 16px;
  height: auto;
  margin: auto;
`;
