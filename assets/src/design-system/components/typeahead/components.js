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
import { Chevron, Close as Clear } from '../../icons';
import { themeHelpers } from '../../theme';
import { Text } from '../typography';

export const DropDownContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Hint = styled(Text)`
  margin-top: 12px;
  padding-left: 2px;
  color: ${({ theme, hasError }) =>
    hasError ? theme.colors.fg.negative : theme.colors.fg.tertiary};
`;
Hint.propTypes = {
  hasError: PropTypes.bool,
};

export const InputContainer = styled.div`
  display: flex;
  position: relative;
  box-sizing: border-box;
  height: 36px;
  background-color: ${({ theme }) => theme.colors.bg.primary};
`;

export const Input = styled.input(
  ({ theme, isOpen, hasError }) => css`
    position: absolute;
    padding: 8px 20px 8px 12px;
    height: 100%;
    width: 100%;
    background-color: transparent;
    outline: none;
    color: ${theme.colors.fg.primary};
    border-radius: ${theme.borders.radius.small};
    ${themeHelpers.focusableOutlineCSS(theme.colors.border.focus)};
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

export const IconContainer = styled.button`
  position: absolute;
  right: 0;
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
  color: ${({ theme }) => theme.colors.fg.secondary};
  cursor: pointer;

  &:not(button) {
    pointer-events: none;
  }

  ${({ theme }) => themeHelpers.focusableOutlineCSS(theme.colors.border.focus)};
  ${({ theme, disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      color: ${theme.colors.fg.disable};
    `}
`;

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
