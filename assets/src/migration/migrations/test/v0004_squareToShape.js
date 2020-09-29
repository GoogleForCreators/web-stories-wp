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
import dataSquareToShape from '../v0004_squareToShape';

describe('dataSquareToShape', () => {
  it('should convert all square elements', () => {
    expect(
      dataSquareToShape({
        _test: 'story',
        pages: [
          {
            _test: 'page1',
            elements: [
              {
                _test: 'element1',
                type: 'square',
                x: 10,
                y: 20,
                width: 101,
                height: 201,
              },
              {
                _test: 'element2',
                type: 'square',
                x: 29,
                y: 55,
                width: 101,
                height: 201,
                fontSize: 22,
              },
            ],
          },
          {
            _test: 'page2',
            elements: [
              {
                _test: 'element3',
                type: 'square',
                x: 29,
                y: 55,
                width: 101,
                height: 201,
                fontSize: 22,
              },
            ],
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
              type: 'shape',
              x: 10,
              y: 20,
              width: 101,
              height: 201,
            },
            {
              _test: 'element2',
              type: 'shape',
              x: 29,
              y: 55,
              width: 101,
              height: 201,
              fontSize: 22,
            },
          ],
        },
        {
          _test: 'page2',
          elements: [
            {
              _test: 'element3',
              type: 'shape',
              x: 29,
              y: 55,
              width: 101,
              height: 201,
              fontSize: 22,
            },
          ],
        },
      ],
    });
  });
});
