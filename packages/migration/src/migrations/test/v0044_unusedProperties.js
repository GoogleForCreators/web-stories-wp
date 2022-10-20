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
import unusedProperties from '../v0044_unusedProperties';

describe('unusedProperties', () => {
  it('should remove backgroundOverlay and fontWeight', () => {
    expect(
      unusedProperties({
        pages: [
          {
            elements: [
              {
                id: '1',
                type: 'text',
                fontWeight: 400,
              },
              {
                id: '2',
                type: 'image',
              },
              {
                id: '3',
                type: 'video',
                backgroundOverlay: {
                  type: 'radial',
                  size: { w: 0.8, h: 0.5 },
                  stops: [
                    { color: { r: 0, g: 0, b: 0, a: 0 }, position: 0.25 },
                    { color: { r: 0, g: 0, b: 0, a: 1 }, position: 1 },
                  ],
                  alpha: 0.6,
                },
              },
            ],
          },
          {
            elements: [
              {
                id: '4',
                type: 'text',
                fontWeight: 700,
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
              id: '1',
              type: 'text',
            },
            {
              id: '2',
              type: 'image',
            },
            {
              id: '3',
              type: 'video',
            },
          ],
        },
        {
          elements: [
            {
              id: '4',
              type: 'text',
            },
          ],
        },
      ],
    });
  });
});
