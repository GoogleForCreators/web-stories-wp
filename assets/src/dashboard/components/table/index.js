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

export const Table = styled.table`
  border-collapse: collapse;
  width: inherit;
  font-family: ${({ theme }) => theme.fonts.table.family};
  font-size: ${({ theme }) => theme.fonts.table.size}px;
  letter-spacing: ${({ theme }) => theme.fonts.table.letterSpacing}em;
`;

export const TableBody = styled.tbody``;

export const TableHeader = styled.thead`
  background: ${({ theme }) => theme.colors.gray50};
  border-top: ${({ theme }) => theme.table.border};
  border-bottom: ${({ theme }) => theme.table.border};
`;

export const TableHeaderCell = styled.th`
  padding: ${({ theme }) => theme.table.headerCellPadding}px;
  font-weight: ${({ theme }) => theme.fonts.table.weight};
  color: ${({ theme }) => theme.colors.gray500};
  text-align: left;
`;

export const TablePreviewHeaderCell = styled(TableHeaderCell)`
  padding-right: 0;
`;

export const TableTitleHeaderCell = styled(TableHeaderCell)`
  padding-left: 0;
`;

export const TableRow = styled.tr``;

export const TableCell = styled.td`
  padding: 0 ${({ theme }) => theme.table.cellPadding}px;
  font-weight: ${({ theme }) => theme.fonts.table.weight};
  color: ${({ theme }) => theme.colors.gray900};
  height: ${({ theme }) => theme.table.cellPadding * 2 + 50}px;
  vertical-align: middle;
  line-height: ${({ theme }) => theme.table.headerContentSize}px;
`;

export const TablePreviewCell = styled(TableCell)`
  width: ${({ theme }) => theme.previewWidth.thumbnail}px;
`;
