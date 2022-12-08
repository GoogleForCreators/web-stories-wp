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
import getVideoLengthDisplay from '../getVideoLengthDisplay';

describe('getVideoLengthDisplay', () => {
  it.each([
    [0, '0:00'],
    [60, '1:00'],
    [610, '10:10'],
    [6000, '1:40:00'],
  ])('getVideoLengthDisplay(%d) should return %s', (length, expected) => {
    expect(getVideoLengthDisplay(length)).toBe(expected);
  });
});
