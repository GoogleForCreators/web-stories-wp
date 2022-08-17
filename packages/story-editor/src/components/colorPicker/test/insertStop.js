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
import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

/**
 * Internal dependencies
 */
import insertStop from '../insertStop';

const WHITE = { r: 255, g: 255, b: 255 };
const BLACK = { r: 0, g: 0, b: 0 };
const ABLACK = { r: 0, g: 0, b: 0, a: 0 };
const GRAY80 = { r: 51, g: 51, b: 51 };
const MGRAY80 = { r: 51, g: 51, b: 51, a: 0.2 };

expect.extend({ toBeDeepCloseTo });

describe('insertStop', () => {
  it('should correctly find position at start of list', () => {
    const stops = [
      { color: WHITE, position: 0.5 },
      { color: BLACK, position: 0.7 },
    ];
    const newPosition = 0;

    const result = insertStop(stops, newPosition);

    expect(result).toStrictEqual({
      index: 0,
      color: WHITE,
    });
  });

  it('should correctly find position at end of list', () => {
    const stops = [
      { color: WHITE, position: 0.5 },
      { color: BLACK, position: 0.7 },
    ];
    const newPosition = 0.8;

    const result = insertStop(stops, newPosition);

    expect(result).toStrictEqual({
      index: 2,
      color: BLACK,
    });
  });

  it('should find position and color between existing stops', () => {
    const stops = [
      { color: WHITE, position: 0 },
      { color: BLACK, position: 1 },
    ];
    const newPosition = 0.8;

    const result = insertStop(stops, newPosition);

    expect(result).toStrictEqual({
      index: 1,
      color: GRAY80,
    });
  });

  it('should find average opacity too', () => {
    const stops = [
      { color: WHITE, position: 0 },
      { color: ABLACK, position: 1 },
    ];
    const newPosition = 0.8;

    const result = insertStop(stops, newPosition);

    // Due to floating-point rounding errors, the .2 might be .199999999
    expect(result).toBeDeepCloseTo(
      {
        index: 1,
        color: MGRAY80,
      },
      2 // must match within two decimals
    );
  });
});
