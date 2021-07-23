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
import { Icons, Text, themeHelpers } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import {
  STORY_PREVIEW_WIDTH,
  VIEWPORT_BREAKPOINT,
} from '../../../../../constants';
import { TableRow, MoreVerticalButton } from '../../../../../components';

const { focusableOutlineCSS } = themeHelpers;

export const ListView = styled.div`
  width: 100%;
`;

export const PreviewImage = styled.div`
  display: inline-block;
  background: ${({ theme }) => theme.colors.gradient.placeholder};
  width: ${STORY_PREVIEW_WIDTH[VIEWPORT_BREAKPOINT.THUMBNAIL]}px;
  height: ${STORY_PREVIEW_WIDTH[VIEWPORT_BREAKPOINT.THUMBNAIL] / (3 / 4)}px;
  object-fit: contain;
  border-radius: ${({ theme }) => theme.borders.radius.small};
`;
export const PreviewWrapper = styled.div`
  position: relative;
`;

export const LockIcon = styled(Icons.LockClosed)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 24px;
  height: 24px;
  display: block;
  margin: auto;
  background-color: ${({ theme }) => theme.colors.interactiveBg.brandNormal};
  color: ${({ theme }) => theme.colors.standard.white};
  border-radius: ${({ theme }) => theme.borders.radius.round};
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

export const HeavyTitle = styled(Text)`
  font-weight: 700;
`;

export const SelectableTitle = styled(HeavyTitle).attrs({ tabIndex: 0 })`
  color: ${({ theme }) => theme.colors.fg.linkNormal};
  cursor: pointer;

  ${({ theme }) =>
    focusableOutlineCSS(theme.colors.border.focus, theme.colors.bg.secondary)};
`;

export const StyledTableRow = styled(TableRow)`
  &:hover ${MoreVerticalButton}, &:focus-within ${MoreVerticalButton} {
    opacity: 1;
  }
`;

export const TitleTableCellContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  ${MoreVerticalButton} {
    margin: 10px auto;
  }

  &:hover ${MoreVerticalButton}, &:active ${MoreVerticalButton} {
    opacity: 1;
  }
`;
