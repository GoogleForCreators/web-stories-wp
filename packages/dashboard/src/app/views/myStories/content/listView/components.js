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
import { Text, themeHelpers } from '@web-stories-wp/design-system';

const { focusableOutlineCSS } = themeHelpers;

export const ListView = styled.div`
  width: 100%;
`;

export const ArrowIcon = styled.div`
  width: 32px;
  height: 100%;
  display: inline-grid;
  color: ${({ theme }) => theme.colors.fg.primary};
  vertical-align: middle;

  svg {
    visibility: ${({ active }) => (active ? 'visible' : 'hidden')};
    transition: transform 0.15s;

    ${({ asc }) =>
      asc &&
      css`
        transform: rotate(180deg);
      `};
  }
`;

export const EmptyIconSpace = styled.div`
  height: 32px;
  width: 32px;
`;

export const ArrowIconWithTitle = styled(ArrowIcon)`
  display: ${({ active }) => !active && 'none'};
  position: absolute;
  top: 16px;

  @media ${({ theme }) => theme.breakpoint.mobile} {
    margin-left: 4px;
  }
`;

export const SelectableTitle = styled(Text).attrs({
  tabIndex: 0,
  isBold: true,
})`
  color: ${({ theme }) => theme.colors.blue[70]};
  cursor: pointer;

  ${({ theme }) =>
    focusableOutlineCSS(theme.colors.border.focus, theme.colors.bg.secondary)};
`;
