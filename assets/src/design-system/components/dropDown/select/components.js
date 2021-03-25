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
import { ChevronDownSmall } from '../../../icons';
import { themeHelpers } from '../../../theme';
import { Text } from '../../typography';

export const SelectButton = styled.button(
  ({ theme, hasError, isOpen }) => css`
    width: 100%;
    height: 36px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;

    border-radius: ${theme.borders.radius.small};
    background-color: ${theme.colors.opacity.footprint};
    border: 1px solid
      ${theme.colors.border[isOpen ? 'defaultActive' : 'defaultNormal']};

    padding: 8px 0 8px 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;

    ${themeHelpers.focusableOutlineCSS(
      theme.colors.border.focus,
      theme.colors.bg.secondary
    )}

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

      &:hover {
        border-color: ${theme.colors.border.disable};
      }

      label,
      span,
      svg {
        color: ${theme.colors.fg.disable};
      }
    }
  `
);

SelectButton.propTypes = {
  hasError: PropTypes.bool,
  isOpen: PropTypes.bool,
};

export const ChevronWrap = styled.div(
  ({ theme, isOpen }) => css`
    color: ${theme.colors.fg.secondary};
    width: 32px;
    height: 32px;

    ${isOpen &&
    css`
      transform: rotate(180deg);
    `}
  `
);
ChevronWrap.propTypes = {
  isOpen: PropTypes.bool,
};

export const StyledChevron = styled(ChevronDownSmall)`
  width: 32px;
  height: auto;
`;

export const Value = styled(Text)`
  max-width: 100%;
  padding-right: 8px;
  color: ${({ theme }) => theme.colors.fg.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const LabelText = styled(Text)`
  color: ${({ theme }) => theme.colors.fg.secondary};
  padding-right: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: hidden;
`;

export const Label = styled.span`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.fg.secondary};
  cursor: pointer;
`;
