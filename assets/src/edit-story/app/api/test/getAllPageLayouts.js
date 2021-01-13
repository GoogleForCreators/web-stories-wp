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
import getAllPageLayouts from '../getAllPageLayouts';

jest.mock('../../../../dashboard/templates');
import getAllTemplates from '../../../../dashboard/templates';

describe('getAllPageLayouts', () => {
  const cdnURL = 'https://test.url';
  const templates = [
    {
      id: 'templateid',
      pages: [
        {
          id: 'pageid',
          elements: [
            {
              id: 'elementid',
              type: 'image',
              x: 25,
              y: 25,
              focalX: 25,
              focalY: 25,
              scale: 100,
              resource: {
                id: 'resourceid',
                type: 'image',
                source: 'https://bad.url/image.jpg',
              },
            },
          ],
        },
      ],
    },
  ];

  beforeEach(() => {
    getAllTemplates.mockResolvedValue(templates);
  });

  it('should get templates w/ cdnURL and images replaced with placeholders', async () => {
    const result = await getAllPageLayouts({ cdnURL });

    expect(getAllTemplates).toHaveBeenCalledWith({ cdnURL });
    expect(result).toStrictEqual([
      {
        id: 'templateid',
        pages: [
          {
            id: 'pageid',
            elements: [
              {
                id: 'elementid',
                type: 'image',
                x: 25,
                y: 25,
                scale: 100,
                focalX: 50,
                focalY: 50,
                backgroundColor: {
                  color: { r: 219, g: 223, b: 226 },
                },
                resource: {
                  type: 'image',
                  mimeType: 'image/png',
                  src: 'http://www.squidsuds.com/i/gwsplaceholder.png',
                  width: 412,
                  height: 732,
                  posterId: 0,
                  id: 0,
                  title: 'Placeholder',
                  alt: 'Placeholder',
                  local: false,
                  sizes: [],
                },
              },
            ],
          },
        ],
      },
    ]);
  });
});
