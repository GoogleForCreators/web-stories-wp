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
  it('should correctly format 0', () => {
    expect(getVideoLengthDisplay(0, true)).toBe('0:00');
  });

  it('should return correct results', () => {
    expect(getVideoLengthDisplay(1)).toBe('0:01');
    expect(getVideoLengthDisplay(60)).toBe('1:00');
    expect(getVideoLengthDisplay(610)).toBe('10:10');
    expect(getVideoLengthDisplay(6000)).toBe('1:40:00');
  });
});
