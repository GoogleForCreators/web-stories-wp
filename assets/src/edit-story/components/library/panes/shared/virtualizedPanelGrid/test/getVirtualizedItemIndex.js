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
 * Internal dependencies
 */
import { getVirtualizedItemIndex } from '../getVirtualizedItemIndex';

describe('getVirtualizedItemIndex', () => {
  it.each`
    rowIndex | columnIndex | returnedGridIndex
    ${0}     | ${0}        | ${0}
    ${0}     | ${1}        | ${1}
    ${1}     | ${0}        | ${2}
    ${1}     | ${1}        | ${3}
    ${2}     | ${0}        | ${4}
    ${2}     | ${1}        | ${5}
    ${3}     | ${0}        | ${6}
    ${10}    | ${0}        | ${20}
    ${10}    | ${1}        | ${21}
    ${49}    | ${1}        | ${99}
    ${101}   | ${0}        | ${202}
  `(
    'Should return `$returnedGridIndex` when columnIndex is `$columnIndex` and rowIndex is `$rowIndex`',
    ({ rowIndex, columnIndex, returnedGridIndex }) => {
      expect(getVirtualizedItemIndex({ rowIndex, columnIndex })).toStrictEqual(
        returnedGridIndex
      );
    }
  );
});
