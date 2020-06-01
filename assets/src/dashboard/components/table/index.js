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
/**
 * Internal dependencies
 */
import { TypographyPresets } from '../typography';

export const Table = styled.table`
  ${TypographyPresets.Small};
  border-collapse: collapse;
  width: inherit;
`;

export const TableBody = styled.tbody``;

export const TableHeader = styled.thead`
  background: ${({ theme }) => theme.colors.gray50};
  border-top: ${({ theme }) => theme.table.border};
  border-bottom: ${({ theme }) => theme.table.border};
`;

export const TableHeaderCell = styled.th`
  padding: ${({ theme }) => theme.table.headerCellPadding}px;
  font-weight: ${({ theme }) => theme.typography.weight.normal};
  color: ${({ theme }) => theme.colors.gray500};
  text-align: left;
`;

export const TablePreviewHeaderCell = styled(TableHeaderCell)`
  padding-right: 0;

  @media ${({ theme }) => theme.breakpoint.largeDisplayPhone} {
    display: none;
  }
`;

export const TableDateHeaderCell = styled(TableHeaderCell)`
  min-width: 160px;

  @media ${({ theme }) => theme.breakpoint.largeDisplayPhone} {
    min-width: 150px;
  }
`;

export const TableStatusHeaderCell = styled(TableHeaderCell)`
  display: table-cell;
  min-width: 100px;

  @media ${({ theme }) => theme.breakpoint.tablet} {
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

  @media ${({ theme }) => theme.breakpoint.largeDisplayPhone} {
    padding-left: ${({ theme }) => theme.table.headerCellPadding}px;
    span {
      display: inline;
    }
  }
`;

export const TableContentHeaderCell = styled(TableHeaderCell)`
  width: 17.5%;
  min-width: 150px;
`;

export const TableRow = styled.tr``;

export const TableCell = styled.td`
  padding: ${({ theme }) => theme.table.cellPadding}px;
  font-weight: ${({ theme }) => theme.typography.weight.normal};
  word-break: break-word;
  font-size: ${({ theme }) => theme.typography.presets.s.size}px;
  color: ${({ theme }) => theme.colors.gray900};
  height: ${({ theme }) => theme.table.cellPadding * 2 + 50}px;
  vertical-align: middle;
  line-height: ${({ theme }) => theme.table.headerContentSize}px;
`;

export const TableStatusCell = styled(TableCell)`
  display: table-cell;
  color: ${({ theme }) => theme.colors.gray400};
  font-weight: 500;

  @media ${({ theme }) => theme.breakpoint.tablet} {
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
  width: ${({ theme }) => theme.previewWidth.thumbnail}px;

  @media ${({ theme }) => theme.breakpoint.largeDisplayPhone} {
    display: none;
  }
`;
