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
import { findMatchingColor } from '../utils';

describe('Panels/StylePreset/utils', () => {
  it('should return matching color object', () => {
    const stylePresets = {
      textColors: [
        {
          color: {
            r: 1,
            g: 1,
            b: 1,
          },
        },
        {
          color: {
            r: 2,
            g: 2,
            b: 1,
          },
        },
      ],
    };
    const color = {
      color: {
        r: 1,
        g: 1,
        b: 1,
      },
    };
    expect(findMatchingColor(color, stylePresets, true)).toStrictEqual(color);
  });

  it('should return undefined when not finding matching color', () => {
    const stylePresets = {
      textColors: [
        {
          color: {
            r: 1,
            g: 2,
            b: 3,
          },
        },
        {
          color: {
            r: 2,
            g: 2,
            b: 1,
          },
        },
      ],
    };
    const color = {
      color: {
        r: 1,
        g: 1,
        b: 1,
      },
    };
    expect(findMatchingColor(color, stylePresets, true)).not.toBeDefined();
  });
});
