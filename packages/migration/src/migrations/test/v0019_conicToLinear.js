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
import conicToLinear from '../v0019_conicToLinear';

describe('conicToLinear', () => {
  it('should convert conic to linear', () => {
    expect(
      conicToLinear({
        _test: 'story',
        pages: [
          {
            _test: 'page1',
            elements: [
              {
                _test: 'element1',
                backgroundColor: {
                  color: { r: 1, g: 1, b: 1 },
                },
              },
              {
                _test: 'element2',
                backgroundColor: {
                  type: 'conic',
                  stops: [
                    {
                      color: { r: 1, g: 1, b: 1 },
                    },
                    {
                      color: { r: 1, g: 1, b: 1 },
                    },
                  ],
                },
              },
              {
                _test: 'element3',
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
              backgroundColor: {
                color: { r: 1, g: 1, b: 1 },
              },
            },
            {
              _test: 'element2',
              backgroundColor: {
                type: 'linear',
                stops: [
                  {
                    color: { r: 1, g: 1, b: 1 },
                  },
                  {
                    color: { r: 1, g: 1, b: 1 },
                  },
                ],
              },
            },
            {
              _test: 'element3',
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
