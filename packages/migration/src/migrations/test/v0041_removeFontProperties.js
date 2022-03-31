/*
 * Copyright 2022 Google LLC
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
import removeFontProperties from '../v0041_removeFontProperties.js';

describe('removeFontProperties', () => {
  it('should migrate to Andada Pro font', () => {
    expect(
      removeFontProperties({
        pages: [
          {
            elements: [
              {
                _test: 'element1',
                type: 'text',
                x: 10,
                y: 20,
                width: 100,
                height: 200,
                font: {
                  family: 'Andada',
                  name: 'Andada',
                  id: 'Andada',
                  value: 'Andada',
                  fallbacks: ['serif'],
                  weights: [400, 500, 600],
                  styles: ['regular'],
                  variants: [
                    [0, 400],
                    [0, 500],
                    [0, 600],
                    [0, 700],
                    [0, 800],
                  ],
                  service: 'fonts.google.com',
                },
              },
            ],
          },
          {
            elements: [
              {
                _test: 'element1',
                type: 'square',
                x: 10,
                y: 20,
                width: 100,
                height: 200,
              },
            ],
          },
        ],
      })
    ).toStrictEqual({
      pages: [
        {
          elements: [
            {
              _test: 'element1',
              type: 'text',
              x: 10,
              y: 20,
              width: 100,
              height: 200,
              font: {
                family: 'Andada',
                fallbacks: ['serif'],
                weights: [400, 500, 600],
                styles: ['regular'],
                variants: [
                  [0, 400],
                  [0, 500],
                  [0, 600],
                  [0, 700],
                  [0, 800],
                ],
                service: 'fonts.google.com',
              },
            },
          ],
        },
        {
          elements: [
            {
              _test: 'element1',
              type: 'square',
              x: 10,
              y: 20,
              width: 100,
              height: 200,
            },
          ],
        },
      ],
    });
  });
});
