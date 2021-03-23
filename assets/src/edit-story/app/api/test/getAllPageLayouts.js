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
 * External dependencies
 */
import getAllTemplates from '@web-stories-wp/templates';
/**
 * Internal dependencies
 */
import getAllPageLayouts from '../getAllPageLayouts';

jest.mock('@web-stories-wp/templates');

describe('getAllPageLayouts', () => {
  const cdnURL = 'https://test.url';
  const assetsURL = 'https://plugin.url/assets/';
  const templates = [
    {
      id: 'templateid',
      pages: [
        {
          id: 'pageid',
          elements: [
            {
              id: 'elementid1',
              type: 'image',
              x: 25,
              y: 25,
              width: 1,
              height: 1,
              scale: 50,
              focalX: 25,
              focalY: 25,
              isBackground: true,
              resource: {
                id: 'resourceid',
                type: 'image',
                source: 'https://bad.url/image.jpg',
              },
            },
            {
              id: 'elementid2',
              type: 'image',
              x: 25,
              y: 25,
              width: 206,
              height: 206,
              scale: 100,
              focalX: 25,
              focalY: 25,
              resource: {
                id: 'resourceid',
                type: 'image',
                source: 'https://bad.url/image.jpg',
              },
            },
            {
              id: 'elementid3',
              type: 'text',
              content: 'content',
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
    const result = await getAllPageLayouts({ cdnURL, assetsURL });

    expect(getAllTemplates).toHaveBeenCalledWith({ cdnURL });
    expect(result).toStrictEqual([
      {
        id: 'templateid',
        pages: [
          {
            id: 'pageid',
            elements: [
              {
                id: 'elementid1',
                type: 'image',
                x: 25,
                y: 25,
                width: 1,
                height: 1,
                scale: 100,
                focalX: 50,
                focalY: 50,
                backgroundColor: {
                  color: { r: 219, g: 223, b: 226 },
                },
                isBackground: true,
                resource: {
                  type: 'image',
                  mimeType: 'image/png',
                  src:
                    'https://plugin.url/assets/images/editor/grid-placeholder.png',
                  width: 1680,
                  height: 2938,
                  posterId: 0,
                  id: 0,
                  title: 'Placeholder',
                  alt: 'Placeholder',
                  local: false,
                  sizes: [],
                },
              },
              {
                id: 'elementid2',
                type: 'image',
                x: 25,
                y: 25,
                width: 206,
                height: 206,
                scale: 200,
                focalX: 50,
                focalY: 50,
                backgroundColor: {
                  color: { r: 219, g: 223, b: 226 },
                },
                resource: {
                  type: 'image',
                  mimeType: 'image/png',
                  src:
                    'https://plugin.url/assets/images/editor/grid-placeholder.png',
                  width: 1680,
                  height: 2938,
                  posterId: 0,
                  id: 0,
                  title: 'Placeholder',
                  alt: 'Placeholder',
                  local: false,
                  sizes: [],
                },
              },
              {
                id: 'elementid3',
                type: 'text',
                content: 'content',
              },
            ],
          },
        ],
      },
    ]);
  });
});
