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
import dataPixelTo412 from '../v0022_dataPixelTo412';

describe('dataPixelTo412', () => {
  it('should convert all pixel props', () => {
    expect(
      dataPixelTo412({
        _test: 'story',
        pages: [
          {
            _test: 'page1',
            elements: [
              {
                _test: 'element1',
                x: 0,
                y: 0,
                width: 440,
                height: 660,
              },
              {
                _test: 'element2',
                x: 10,
                y: 20,
                width: 100,
                height: 200,
                fontSize: 22,
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
              x: 0,
              y: 0,
              width: 412,
              height: 618,
            },
            {
              _test: 'element2',
              x: 9,
              y: 19,
              width: 94,
              height: 187,
              fontSize: 21,
              padding: { horizontal: 9, vertical: 9 },
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
