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
import { text } from '@storybook/addon-knobs';

/**
 * Internal dependencies
 */
import {
  Table,
  TableBody,
  TableCell,
  TableHeaderCell,
  TableRow,
  TableHeader,
} from '../';

export default {
  title: 'Dashboard/Components/Table',
  component: Table,
};

const tableData = [
  { id: 1, title: 'Fashion', author: 'Carlos', date: 'July 13' },
  { id: 2, title: 'Sports', author: 'Max', date: 'April 12' },
  { id: 3, title: 'Music & Vinyl', author: 'Brittany', date: 'March 27' },
  { id: 4, title: 'Arts & Culture', author: 'Mariano', date: 'September 5' },
];

export const _default = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>
            {text('tableHeaderPrimary', 'Title')}
          </TableHeaderCell>
          <TableHeaderCell>
            {text('tableHeaderSecondary', 'Author')}
          </TableHeaderCell>
          <TableHeaderCell>
            {text('tableHeaderTertiary', 'Date')}
          </TableHeaderCell>
        </TableRow>
      </TableHeader>

      <TableBody>
        {tableData.map((data) => (
          <TableRow key={data.id}>
            <TableCell>{data.title}</TableCell>
            <TableCell>{data.author}</TableCell>
            <TableCell>{data.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
