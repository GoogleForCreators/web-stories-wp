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
import clamp from '../clamp';

describe('clamp', () => {
  it('should return 2 when range is [1, 6] and value is 2', () => {
    const range = [1, 6];
    const clampedNumber = clamp(2, range);

    expect(clampedNumber).toBe(2);
  });

  it('should return 1 when range is [1, 6] and value is 8', () => {
    const range = [1, 6];
    const clampedNumber = clamp(8, range);

    expect(clampedNumber).toBe(6);
  });

  it('should return 6 when range is [1, 6] and value is 0', () => {
    const range = [1, 6];
    const clampedNumber = clamp(0, range);

    expect(clampedNumber).toBe(1);
  });

  it('should return 1 when range is [1, 6] and value is -1', () => {
    const range = [1, 6];
    const clampedNumber = clamp(-1, range);

    expect(clampedNumber).toBe(1);
  });

  it('should return 5.4 when range is [1, 6] and value is 5.4', () => {
    const range = [1, 6];
    const clampedNumber = clamp(5.4, range);

    expect(clampedNumber).toBe(5.4);
  });

  it('should return 6 when range is [1, 6] and value is 6.4', () => {
    const range = [1, 6];
    const clampedNumber = clamp(6.4, range);

    expect(clampedNumber).toBe(6);
  });
});
