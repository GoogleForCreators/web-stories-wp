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
import styled from 'styled-components';
import { themeHelpers } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { STORY_PREVIEW_WIDTH, VIEWPORT_BREAKPOINT } from '../../constants';

const CELL_PADDING = 16;

export const Table = styled.table`
  ${themeHelpers.expandTextPreset(
    ({ paragraph }, { SMALL }) => paragraph[SMALL]
  )}
  border-collapse: collapse;
  width: inherit;
`;

export const TableBody = styled.tbody``;

export const TableHeader = styled.thead`
  background: ${({ theme }) => theme.colors.bg.secondary};
`;

export const StickyTableHeader = styled(TableHeader)`
  width: 100%;
  border-top: 0;
  border-bottom: 0;

  th {
    height: 100%;
    background: ${({ theme }) => theme.colors.bg.secondary};
    position: sticky;
    z-index: 2;
    top: ${({ topOffset }) => `${topOffset}px`};

    :first-child {
      border-top-left-radius: ${({ theme }) => theme.borders.radius.small};
      border-bottom-left-radius: ${({ theme }) => theme.borders.radius.small};
    }

    :last-child {
      border-top-right-radius: ${({ theme }) => theme.borders.radius.small};
      border-bottom-right-radius: ${({ theme }) => theme.borders.radius.small};
    }
  }
`;

export const TableHeaderCell = styled.th`
  padding: 16px;
  text-align: left;
  white-space: nowrap;
`;

export const TablePreviewHeaderCell = styled(TableHeaderCell)`
  padding-right: 0;
`;

export const TableDateHeaderCell = styled(TableHeaderCell)`
  min-width: 160px;
`;

export const TableStatusHeaderCell = styled(TableHeaderCell)`
  display: table-cell;
  min-width: 100px;

  @media ${({ theme }) => theme.breakpoint.tabletMax} {
    display: none;
  }
`;

export const TableAuthorHeaderCell = styled(TableHeaderCell)`
  min-width: 110px;
`;

export const TableTitleHeaderCell = styled(TableHeaderCell)`
  padding-left: 0;
  width: 30%;
  min-width: 135px;

  span {
    display: none;
    margin-right: 5px;
  }
`;

export const TableContentHeaderCell = styled(TableHeaderCell)`
  width: 17.5%;
  min-width: 150px;
`;

export const TableRow = styled.tr`
  min-width: 1250px;

  @media ${({ theme }) => theme.breakpoint.tabletMax} {
    min-width: 0;
  }
`;

export const TableCell = styled.td`
  padding: ${CELL_PADDING}px;
  font-weight: normal;
  word-break: break-word;
  height: ${CELL_PADDING * 2 + 50}px;
  vertical-align: middle;

  span {
    color: ${({ theme }) => theme.colors.standard.black};
    line-height: 20px;
  }
`;

export const TableStatusCell = styled(TableCell)`
  display: table-cell;

  span {
    color: ${({ theme }) => theme.colors.fg.secondary};
  }

  @media ${({ theme }) => theme.breakpoint.tabletMax} {
    display: none;
  }
`;

export const TableTitleCell = styled(TableCell)`
  width: 30%;
  word-wrap: break-word;
`;

export const TableContentCell = styled(TableCell)`
  width: 17.5%;
  min-width: 150px;
  word-wrap: break-word;
`;

export const TablePreviewCell = styled(TableCell)`
  width: ${STORY_PREVIEW_WIDTH[VIEWPORT_BREAKPOINT.THUMBNAIL]}px;
`;
