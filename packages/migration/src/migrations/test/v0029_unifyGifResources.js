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
import unifyGifResources from '../v0029_unifyGifResources';

describe('unifyGifResources', () => {
  it('should update GIF resource format', () => {
    expect(
      unifyGifResources({
        _test: 'story',
        pages: [
          {
            _test: 'page1',
            elements: [
              {
                opacity: 100,
                flip: {
                  vertical: false,
                  horizontal: false,
                },
                rotationAngle: 0,
                lockAspectRatio: true,
                scale: 100,
                focalX: 50,
                focalY: 50,
                resource: {
                  type: 'gif',
                  mimeType: 'image/gif',
                  creationDate: '2019-11-13T18:15:52Z',
                  src: 'https://c.tenor.com/MU7TSJjNtA0AAAAC/flapjack-smile.gif',
                  width: 498,
                  height: 361,
                  alt: 'media/tenor:3553009464796623885',
                  sizes: {
                    full: {
                      file: 'media/tenor:3553009464796623885',
                      source_url:
                        'https://c.tenor.com/MU7TSJjNtA0AAAAC/flapjack-smile.gif',
                      mime_type: 'image/gif',
                      width: 498,
                      height: 361,
                    },
                    large: {
                      file: 'media/tenor:3553009464796623885',
                      source_url:
                        'https://c.tenor.com/MU7TSJjNtA0AAAAM/flapjack-smile.gif',
                      mime_type: 'image/gif',
                      width: 220,
                      height: 160,
                    },
                    web_stories_thumbnail: {
                      file: 'media/tenor:3553009464796623885',
                      source_url:
                        'https://c.tenor.com/MU7TSJjNtA0AAAAS/flapjack-smile.gif',
                      mime_type: 'image/gif',
                      width: 124,
                      height: 90,
                    },
                  },
                  attribution: {
                    author: {},
                    registerUsageUrl:
                      'https://media3p.googleapis.com/v1/media:registerUsage?token=AdnbmE9q%2BbGN9PeNDcmeFuRDySDlixmUMmb1Fq55a74d09EwCQk767JW2sZcmUk%2BaLWlD7Mj6xXYkCku9BtqpWuKh%2Buykw%3D%3D',
                  },
                  output: {
                    mimeType: 'video/mp4',
                    sizes: {
                      webm: {
                        full: {
                          file: 'media/tenor:3553009464796623885',
                          source_url:
                            'https://c.tenor.com/MU7TSJjNtA0AAAPs/flapjack-smile.webm',
                          mime_type: 'image/webm',
                          width: 640,
                          height: 464,
                        },
                        preview: {
                          file: 'media/tenor:3553009464796623885',
                          source_url:
                            'https://c.tenor.com/MU7TSJjNtA0AAAP4/flapjack-smile.webm',
                          mime_type: 'image/webm',
                          width: 150,
                          height: 108,
                        },
                      },
                      mp4: {
                        full: {
                          file: 'media/tenor:3553009464796623885',
                          source_url:
                            'https://c.tenor.com/MU7TSJjNtA0AAAPo/flapjack-smile.mp4',
                          mime_type: 'video/mp4',
                          width: 640,
                          height: 464,
                        },
                        preview: {
                          file: 'media/tenor:3553009464796623885',
                          source_url:
                            'https://c.tenor.com/MU7TSJjNtA0AAAP2/flapjack-smile.mp4',
                          mime_type: 'video/mp4',
                          width: 150,
                          height: 108,
                        },
                      },
                    },
                    src: 'https://c.tenor.com/MU7TSJjNtA0AAAPo/flapjack-smile.mp4',
                    poster:
                      'https://c.tenor.com/MU7TSJjNtA0AAAAe/flapjack-smile.png',
                  },
                  local: false,
                  isPlaceholder: false,
                  isOptimized: false,
                  baseColor: [175, 182, 142],
                },
                type: 'gif',
                x: 48,
                y: 0,
                width: 249,
                height: 181,
                mask: {
                  type: 'rectangle',
                  showInLibrary: true,
                  name: 'Rectangle',
                  path: 'M 0,0 1,0 1,1 0,1 0,0 Z',
                  ratio: 1,
                  supportsBorder: true,
                },
                id: 'be0e182e-bfed-43d8-9fe6-000eaee7c94f',
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
              opacity: 100,
              flip: {
                vertical: false,
                horizontal: false,
              },
              rotationAngle: 0,
              lockAspectRatio: true,
              scale: 100,
              focalX: 50,
              focalY: 50,
              resource: {
                id: 'media/tenor:3553009464796623885',
                posterId: 'media/tenor:3553009464796623885',
                type: 'gif',
                mimeType: 'image/gif',
                creationDate: '2019-11-13T18:15:52Z',
                src: 'https://c.tenor.com/MU7TSJjNtA0AAAAC/flapjack-smile.gif',
                poster:
                  'https://c.tenor.com/MU7TSJjNtA0AAAAe/flapjack-smile.png',
                width: 498,
                height: 361,
                alt: 'media/tenor:3553009464796623885',
                sizes: {
                  full: {
                    file: 'media/tenor:3553009464796623885',
                    source_url:
                      'https://c.tenor.com/MU7TSJjNtA0AAAAC/flapjack-smile.gif',
                    mime_type: 'image/gif',
                    width: 498,
                    height: 361,
                  },
                  large: {
                    file: 'media/tenor:3553009464796623885',
                    source_url:
                      'https://c.tenor.com/MU7TSJjNtA0AAAAM/flapjack-smile.gif',
                    mime_type: 'image/gif',
                    width: 220,
                    height: 160,
                  },
                  web_stories_thumbnail: {
                    file: 'media/tenor:3553009464796623885',
                    source_url:
                      'https://c.tenor.com/MU7TSJjNtA0AAAAS/flapjack-smile.gif',
                    mime_type: 'image/gif',
                    width: 124,
                    height: 90,
                  },
                },
                attribution: {
                  author: {},
                  registerUsageUrl:
                    'https://media3p.googleapis.com/v1/media:registerUsage?token=AdnbmE9q%2BbGN9PeNDcmeFuRDySDlixmUMmb1Fq55a74d09EwCQk767JW2sZcmUk%2BaLWlD7Mj6xXYkCku9BtqpWuKh%2Buykw%3D%3D',
                },
                output: {
                  mimeType: 'video/mp4',
                  src: 'https://c.tenor.com/MU7TSJjNtA0AAAPo/flapjack-smile.mp4',
                },
                local: false,
                isPlaceholder: false,
                isOptimized: true,
                baseColor: [175, 182, 142],
              },
              type: 'gif',
              x: 48,
              y: 0,
              width: 249,
              height: 181,
              mask: {
                type: 'rectangle',
                showInLibrary: true,
                name: 'Rectangle',
                path: 'M 0,0 1,0 1,1 0,1 0,0 Z',
                ratio: 1,
                supportsBorder: true,
              },
              id: 'be0e182e-bfed-43d8-9fe6-000eaee7c94f',
            },
          ],
        },
      ],
    });
  });
});
