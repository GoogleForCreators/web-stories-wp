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

export const InputContainer = styled.div`
  display: flex;
  position: relative;
  box-sizing: border-box;
  height: 36px;
  background-color: ${({ theme }) => theme.colors.bg.primary};
`;

export const Input = styled.input(
  ({ theme, isOpen, hasError, hasSearchIcon }) => css`
    position: absolute;
    padding: 8px 20px 8px ${hasSearchIcon ? 32 : 12}px;
    height: 100%;
    width: 100%;
    background-color: transparent;
    outline: none;
    color: ${theme.colors.fg.primary};
    border-radius: ${theme.borders.radius.small};
    ${themeHelpers.focusableOutlineCSS(theme.colors.border.focus)};

    ${themeHelpers.expandPresetStyles({
      preset: theme.typography.presets.paragraph.small,
      theme,
    })};

    /* border color needs to be reapplied from helper for different states */
    border-color: ${theme.colors.border[
      isOpen ? 'defaultActive' : 'defaultNormal'
    ]};

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
      border-color: ${theme.colors.border.focus};
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
  hasError: PropTypes.bool,
  hasSearchIcon: PropTypes.bool,
  isOpen: PropTypes.bool,
};

export const IconContainer = styled.button(
  ({ alignLeft, disabled, theme }) => css`
    position: absolute;
    ${alignLeft
      ? css`
          left: 0;
        `
      : css`
          right: 0;
        `}
    box-sizing: border-box;
    display: flex;
    align-items: center;
    background-color: transparent;
    border: 0;
    padding: 0;
    margin: 0;
    height: 100%;
    width: 32px;
    z-index: 15;
    color: ${theme.colors.fg.secondary};
    cursor: pointer;

    &:not(button) {
      pointer-events: none;
    }

    ${themeHelpers.focusableOutlineCSS(theme.colors.border.focus)};
    ${disabled &&
    css`
      pointer-events: none;
      color: ${theme.colors.fg.disable};
    `}
  `
);
IconContainer.propTypes = {
  alignLeft: PropTypes.bool,
  disabled: PropTypes.bool,
};

export const StyledClear = styled(Clear)`
  width: 8px;
  height: auto;
  margin: 0 auto 0 12px;
`;

export const StyledChevron = styled(Chevron)`
  width: 8px;
  height: auto;
  margin: 0 auto 0 12px;

  ${({ isOpen }) =>
    isOpen &&
    css`
      transform: rotate(180deg);
    `}
`;
StyledChevron.propTypes = {
  isOpen: PropTypes.bool,
};

export const StyledSearch = styled(Search)`
  width: 16px;
  height: auto;
  margin: 0 8px;
`;
