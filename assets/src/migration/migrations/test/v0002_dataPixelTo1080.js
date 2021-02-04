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
import dataPixelTo1080 from '../v0002_dataPixelTo1080';

describe('dataPixelTo1080', () => {
  it('should convert all pixel props', () => {
    expect(
      dataPixelTo1080({
        _test: 'story',
        pages: [
          {
            _test: 'page1',
            elements: [
              {
                _test: 'element1',
                x: 10,
                y: 20,
                width: 100,
                height: 200,
              },
              {
                _test: 'element2',
                x: 11,
                y: 21,
                width: 101,
                height: 201,
                fontSize: 22,
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
              x: 26,
              y: 52,
              width: 262,
              height: 525,
            },
            {
              _test: 'element2',
              x: 29,
              y: 55,
              width: 265,
              height: 527,
              fontSize: 58,
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
