/*
 * Copyright 2021 Google LLC
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
import { getIndex } from '../utils';

describe('getIndex', () => {
  it('will return item index of 4 when in second row and second column of a grid with 3 columns and 7 items.', () => {
    const newIndex = getIndex({
      row: 2,
      column: 2,
      numRows: 3,
      numColumns: 3,
      numItems: 7,
    });

    expect(newIndex).toBe(4);
  });

  it('will return item index of -1 when in first row and first column of a grid with 3 columns and 7 items.', () => {
    const newIndex = getIndex({
      row: 0,
      column: 1,
      numRows: 3,
      numColumns: 3,
      numItems: 7,
    });

    expect(newIndex).toBe(-1);
  });
});
