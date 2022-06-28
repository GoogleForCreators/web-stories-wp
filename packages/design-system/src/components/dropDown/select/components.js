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
import { themeHelpers } from '../../../theme';
import { Text } from '../../typography';

export const SelectButton = styled.button(
  ({ theme, hasError, isOpen, selectButtonStylesOverride }) => css`
    width: 100%;
    height: ${({ autoHeight }) => (autoHeight ? 'auto' : '36px')};
    display: flex;
    align-items: center;
    justify-content: space-between;

    border-radius: ${theme.borders.radius.small};
    background-color: ${theme.colors.opacity.footprint};
    border: 1px solid
      ${theme.colors.border[isOpen ? 'defaultActive' : 'defaultNormal']};

    padding: 8px 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;

    ${themeHelpers.focusableOutlineCSS}

    &:hover {
      border-color: ${theme.colors.border[
        isOpen ? 'defaultActive' : 'defaultHover'
      ]};
    }

    ${hasError &&
    css`
      ${themeHelpers.focusableOutlineCSS(
        theme.colors.interactiveBg.negativeNormal
      )}
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
    ${selectButtonStylesOverride};
  `
);

SelectButton.propTypes = {
  hasError: PropTypes.bool,
  isOpen: PropTypes.bool,
};

export const Value = styled(Text)`
  max-width: 100%;
  padding-right: 8px;
  color: ${({ theme }) => theme.colors.fg.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${({ selectValueStylesOverride }) => selectValueStylesOverride};
`;

export const LabelText = styled(Text)`
  color: ${({ theme }) => theme.colors.fg.secondary};
  padding-right: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
`;

export const Label = styled.span`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.fg.secondary};
  cursor: pointer;
`;
