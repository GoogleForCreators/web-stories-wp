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
import dataPixelTo440 from '../v0010_dataPixelTo440';

describe('dataPixelTo440', () => {
  it('should convert all pixel props', () => {
    expect(
      dataPixelTo440({
        _test: 'story',
        pages: [
          {
            _test: 'page1',
            elements: [
              {
                _test: 'element1',
                x: 40,
                y: 80,
                width: 1080,
                height: 1920,
              },
              {
                _test: 'element2',
                x: 41,
                y: 81,
                width: 401,
                height: 801,
                fontSize: 82,
                padding: { horizontal: 10, vertical: 10 },
              },
            ],
          },
          {
            _test: 'page2',
            elements: [],
          },
        ],
      })
    ).toStrictEqual({
      _test: 'story',
      pages: [
        {
          _test: 'page1',
          elements: [
            {
              _test: 'element1',
              x: 14,
              y: 28,
              width: 371,
              height: 660,
            },
            {
              _test: 'element2',
              x: 14,
              y: 28,
              width: 138,
              height: 275,
              fontSize: 28,
              padding: { horizontal: 3, vertical: 3 },
            },
          ],
        },
        {
          _test: 'page2',
          elements: [],
        },
      ],
    });
  });
});
