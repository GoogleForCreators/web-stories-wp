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
import getUniquePresets from '../getUniquePresets';

describe('getUniquePresets', () => {
  it('should return array of unique presets', () => {
    const repeatingPresets = [
      { color: { r: 181, g: 57, b: 57 } },
      { color: { r: 181, g: 57, b: 57 } },
      { color: { r: 0, g: 57, b: 57 } },
      { color: { r: 0, g: 57, b: 57 } },
      { color: { r: 181, g: 57, b: 0 } },
      { color: { r: 181, g: 57, b: 0 } },
      {
        rotation: 0.5,
        type: 'linear',
        stops: [
          { color: { r: 181, g: 57, b: 0 }, position: 0 },
          { color: { r: 181, g: 57, b: 0 }, position: 1 },
        ],
      },
      {
        rotation: 0.5,
        type: 'linear',
        stops: [
          { color: { r: 181, g: 57, b: 0 }, position: 0 },
          { color: { r: 181, g: 57, b: 0 }, position: 1 },
        ],
      },
    ];

    const uniquePresets = [
      { color: { r: 181, g: 57, b: 57 } },
      { color: { r: 0, g: 57, b: 57 } },
      { color: { r: 181, g: 57, b: 0 } },
      {
        rotation: 0.5,
        type: 'linear',
        stops: [
          { color: { r: 181, g: 57, b: 0 }, position: 0 },
          { color: { r: 181, g: 57, b: 0 }, position: 1 },
        ],
      },
    ];
    expect(getUniquePresets(repeatingPresets)).toStrictEqual(uniquePresets);
  });
});
