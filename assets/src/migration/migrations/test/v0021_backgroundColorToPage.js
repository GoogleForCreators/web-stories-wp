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
import backgroundColorToPage from '../v0021_backgroundColorToPage';

describe('backgroundColorToPage', () => {
  it('should migrate background element color to page', () => {
    expect(
      backgroundColorToPage({
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
                isDefaultBackground: true,
              },
              {
                _test: 'element2',
              },
            ],
          },
          {
            _test: 'page2',
            elements: [
              {
                _test: 'element3',
                backgroundColor: {
                  color: { r: 1, g: 1, b: 1 },
                },
              },
            ],
            defaultBackgroundElement: {
              _test: 'element4',
              backgroundColor: {
                color: { r: 0, g: 0, b: 0 },
              },
            },
          },
          {
            _test: 'page3',
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
              isDefaultBackground: true,
            },
            {
              _test: 'element2',
            },
          ],
          backgroundColor: {
            color: { r: 1, g: 1, b: 1 },
          },
        },
        {
          _test: 'page2',
          elements: [
            {
              _test: 'element3',
              backgroundColor: {
                color: { r: 1, g: 1, b: 1 },
              },
            },
          ],
          defaultBackgroundElement: {
            _test: 'element4',
            backgroundColor: {
              color: { r: 0, g: 0, b: 0 },
            },
          },
          backgroundColor: {
            color: { r: 0, g: 0, b: 0 },
          },
        },
        {
          _test: 'page3',
          elements: [],
          backgroundColor: {
            type: 'solid',
            color: { r: 255, g: 255, b: 255 },
          },
        },
      ],
    });
  });
});
