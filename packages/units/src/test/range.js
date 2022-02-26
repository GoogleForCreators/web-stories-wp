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
import { clamp, lerp, progress } from '../range';

describe('lerp', () => {
  it('equals `target` when `progress === 1`', () => {
    const target = 60;
    expect(lerp(1, { MIN: 0, MAX: target })).toStrictEqual(target);
  });

  it('equals `initial` when `progress === 0`', () => {
    const initial = 60;
    expect(lerp(0, { MIN: initial, MAX: 0 })).toStrictEqual(initial);
  });

  it('calculates normal range properly', () => {
    const range = { MIN: 0, MAX: 100 };
    expect(lerp(0.25, range)).toBe(25);
    expect(lerp(0.5, range)).toBe(50);
    expect(lerp(0.75, range)).toBe(75);
  });

  it('calculates reverse range properly', () => {
    const range = { MIN: 100, MAX: 0 };
    expect(lerp(0.25, range)).toBe(75);
    expect(lerp(0.5, range)).toBe(50);
    expect(lerp(0.75, range)).toBe(25);
  });
});

describe('clamp', () => {
  it('should return 2 when range is [1, 6] and value is 2', () => {
    const range = { MIN: 1, MAX: 6 };
    const clampedNumber = clamp(2, range);

    expect(clampedNumber).toBe(2);
  });

  it('should return 1 when range is [1, 6] and value is 8', () => {
    const range = { MIN: 1, MAX: 6 };
    const clampedNumber = clamp(8, range);

    expect(clampedNumber).toBe(6);
  });

  it('should return 6 when range is [1, 6] and value is 0', () => {
    const range = { MIN: 1, MAX: 6 };
    const clampedNumber = clamp(0, range);

    expect(clampedNumber).toBe(1);
  });

  it('should return 1 when range is [1, 6] and value is -1', () => {
    const range = { MIN: 1, MAX: 6 };
    const clampedNumber = clamp(-1, range);

    expect(clampedNumber).toBe(1);
  });

  it('should return 5.4 when range is [1, 6] and value is 5.4', () => {
    const range = { MIN: 1, MAX: 6 };
    const clampedNumber = clamp(5.4, range);

    expect(clampedNumber).toBe(5.4);
  });

  it('should return 6 when range is [1, 6] and value is 6.4', () => {
    const range = { MIN: 1, MAX: 6 };
    const clampedNumber = clamp(6.4, range);

    expect(clampedNumber).toBe(6);
  });
});

describe('progress', () => {
  it('calculates progress in standard range', () => {
    const standard = { MIN: 0, MAX: 100 };
    expect(progress(0, standard)).toBe(0);
    expect(progress(25, standard)).toBe(0.25);
    expect(progress(50, standard)).toBe(0.5);
    expect(progress(75, standard)).toBe(0.75);
    expect(progress(100, standard)).toBe(1);
  });

  it('calculates progress in negative range', () => {
    const negative = { MIN: -100, MAX: 0 };
    expect(progress(-100, negative)).toBe(0);
    expect(progress(-75, negative)).toBe(0.25);
    expect(progress(-50, negative)).toBe(0.5);
    expect(progress(-25, negative)).toBe(0.75);
    expect(progress(0, negative)).toBe(1);
  });
});
