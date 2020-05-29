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
import padArray from '../padArray';

describe('padArray', () => {
  it('should return array with additional padded items', () => {
    const values = [0, 4, 67, 89.5, 23, 5];

    expect(padArray(values, 2)).toStrictEqual([
      0,
      0,
      4,
      4,
      67,
      67,
      89.5,
      89.5,
      23,
      23,
      5,
      5,
    ]);

    expect(padArray(values, 3)).toStrictEqual([
      0,
      0,
      0,
      4,
      4,
      4,
      67,
      67,
      67,
      89.5,
      89.5,
      89.5,
      23,
      23,
      23,
      5,
      5,
      5,
    ]);
  });
});
