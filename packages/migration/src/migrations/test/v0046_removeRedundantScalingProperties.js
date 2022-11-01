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
import removeRedundantScalingProperties from '../v0046_removeRedundantScalingProperties';

describe('unusedProperties', () => {
  it('should remove scaling properties from non-media elements', () => {
    expect(
      removeRedundantScalingProperties({
        pages: [
          {
            elements: [
              {
                id: '1',
                type: 'text',
                scale: 400,
                focalX: 10,
                focalY: 30,
              },
              {
                id: '2',
                type: 'image',
                resource: {},
                scale: 100,
                focalX: 0,
                focalY: 0,
              },
              {
                id: '3',
                type: 'shape',
                scale: 10,
                focalX: 10,
                focalY: 10,
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
              resource: {},
              scale: 100,
              focalX: 0,
              focalY: 0,
            },
            {
              id: '3',
              type: 'shape',
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
