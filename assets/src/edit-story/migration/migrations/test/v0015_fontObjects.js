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
import fontObjects from '../v0015_fontObjects';

describe('fontObjects', () => {
  it('should convert fontFamily to font object', () => {
    expect(
      fontObjects({
        _test: 'story',
        pages: [
          {
            _test: 'page1',
            elements: [
              {
                _test: 'element1',
                type: 'text',
                fontFamily: 'Roboto',
                fontFallback: ['Helvetica Neue', 'Helvetica', 'sans-serif'],
              },
              {
                _test: 'element2',
                type: 'text',
                fontFamily: 'Arial',
                fontFallback: ['Verdana', 'sans-serif'],
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
              type: 'text',
              font: {
                service: 'fonts.google.com',
                family: 'Roboto',
                fallbacks: ['Helvetica Neue', 'Helvetica', 'sans-serif'],
              },
            },
            {
              _test: 'element2',
              type: 'text',
              font: {
                service: 'system',
                family: 'Arial',
                fallbacks: ['Verdana', 'sans-serif'],
              },
            },
          ],
        },
      ],
    });
  });
});
