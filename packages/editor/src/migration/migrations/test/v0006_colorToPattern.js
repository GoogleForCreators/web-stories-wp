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
import colorToPattern from '../v0006_colorToPattern';

describe('colorToPattern', () => {
  it('should fullbleed to fill', () => {
    expect(
      colorToPattern({
        _test: 'story',
        pages: [
          {
            _test: 'page1',
            backgroundColor: '#fff',
            elements: [
              {
                _test: 'element1',
              },
              {
                _test: 'element2',
                color: 'black',
              },
              {
                _test: 'element3',
                color: 'transparent',
              },
              {
                _test: 'element4',
                color: null,
              },
              {
                _test: 'element5',
                color: '#f00',
              },
              {
                _test: 'element6',
                backgroundColor: '#c0ffee',
              },
              {
                _test: 'element7',
                backgroundColor: 'rgba(255, 0, 0, .5)',
                color: 'salmon',
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
          backgroundColor: { color: { r: 255, g: 255, b: 255 } },
          elements: [
            {
              _test: 'element1',
            },
            {
              _test: 'element2',
              color: { color: { r: 0, g: 0, b: 0 } },
            },
            {
              _test: 'element3',
              color: null,
            },
            {
              _test: 'element4',
              color: null,
            },
            {
              _test: 'element5',
              color: { color: { r: 255, g: 0, b: 0 } },
            },
            {
              _test: 'element6',
              backgroundColor: { color: { r: 192, g: 255, b: 238 } },
            },
            {
              _test: 'element7',
              backgroundColor: { color: { r: 255, g: 0, b: 0, a: 0.5 } },
              color: { color: { r: 250, g: 128, b: 114 } },
            },
          ],
        },
        {
          _test: 'page2',
          backgroundColor: null,
          elements: [],
        },
      ],
    });
  });
});
