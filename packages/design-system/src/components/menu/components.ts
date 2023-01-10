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
import { themeHelpers } from '../../theme';
import type { StyleOverride } from '../../types/theme';
import { DEFAULT_DROPDOWN_HEIGHT } from './constants';

export const MenuContainer = styled.div<{
  dropDownHeight?: number;
  styleOverride?: StyleOverride;
  isAbsolute?: boolean;
}>(
  ({
    dropDownHeight = DEFAULT_DROPDOWN_HEIGHT,
    styleOverride = '',
    theme,
    isAbsolute,
  }) => css`
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: calc(100% - 2px);
    max-height: ${dropDownHeight}px;
    overflow-x: visible;
    overflow-y: auto;
    overscroll-behavior: none auto;
    z-index: 2;
    margin-top: 16px;
    margin-bottom: 8px;
    padding: 4px 0;
    background-color: ${theme.colors.bg.primary};
    border-radius: ${theme.borders.radius.small};
    border: 1px solid ${theme.colors.divider.primary};

    ${isAbsolute &&
    css`
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    `};

    ${styleOverride};

    ${themeHelpers.scrollbarCSS};
  `
);
