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
import getOpaquePattern from '../getOpaquePattern';
import { PatternType } from '../types';
import type { Linear } from '../types';

describe('getOpaquePattern', () => {
  it('should get the opaque color correctly from a solid', () => {
    expect(getOpaquePattern({ color: { r: 1, g: 1, b: 1 } })).toMatchObject({
      color: { r: 1, g: 1, b: 1, a: 1 },
    });
    expect(
      getOpaquePattern({ color: { r: 1, g: 1, b: 1, a: 0.4 } })
    ).toMatchObject({
      color: { r: 1, g: 1, b: 1, a: 1 },
    });
    expect(
      getOpaquePattern({ color: { r: 1, g: 1, b: 1, a: 0 } })
    ).toMatchObject({
      color: { r: 1, g: 1, b: 1, a: 1 },
    });
  });

  it('should get the opaque color correctly from a gradient', () => {
    const input: Linear = {
      type: PatternType.Linear,
      stops: [
        { color: { r: 1, g: 1, b: 1 }, position: 0 },
        { color: { r: 1, g: 1, b: 1, a: 0.5 }, position: 1 },
      ],
      alpha: 0.5,
    };
    const expected: Linear = {
      type: PatternType.Linear,
      stops: [
        { color: { r: 1, g: 1, b: 1 }, position: 0 },
        { color: { r: 1, g: 1, b: 1, a: 0.5 }, position: 1 },
      ],
    };
    expect(getOpaquePattern(input)).toMatchObject(expected);
  });
});
