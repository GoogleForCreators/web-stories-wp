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
import booleanBoldToFontWeight from '../v0013_booleanBoldToFontWeight';

describe('booleanBoldToFontWeight', () => {
  it('should update bold and fontWeight properties', () => {
    expect(
      booleanBoldToFontWeight({
        _test: 'story',
        pages: [
          {
            _test: 'page1',
            elements: [
              {
                _test: 'element1',
                type: 'text',
                fontWeight: '400',
                bold: true,
              },
              {
                _test: 'element2',
                type: 'text',
                fontWeight: '600',
                bold: false,
              },
              {
                _test: 'element3',
                fontWeight: '400',
                type: 'text',
              },
              {
                _test: 'element4',
                type: 'image',
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
              fontWeight: '700',
              type: 'text',
            },
            {
              _test: 'element2',
              fontWeight: '600',
              type: 'text',
            },
            {
              _test: 'element3',
              fontWeight: '400',
              type: 'text',
            },
            {
              _test: 'element4',
              type: 'image',
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
