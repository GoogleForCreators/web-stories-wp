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
import backgroundOverlayToOverlay from '../v0026_backgroundOverlayToOverlay';

describe('backgroundOverlayToOverlay', () => {
  it('should replace backgroundOverlay with overlay', () => {
    expect(
      backgroundOverlayToOverlay({
        _test: 'story',
        pages: [
          {
            _test: 'page1',
            elements: [
              {
                _test: 'element1',
                type: 'image',
                resource: {
                  type: 'image',
                  mimeType: 'image/png',
                  src: 'https://example.com/image.png',
                  width: 123,
                  height: 234,
                },
                x: 12,
                y: 34,
                width: 123,
                height: 345,
                fontSize: 16,
                backgroundOverlay: { r: 1, g: 1, b: 1 },
              },
              {
                _test: 'element2',
                type: 'shape',
                x: 12,
                y: 34,
                width: 123,
                height: 345,
              },
            ],
          },
          {
            _test: 'page2',
            elements: [
              {
                _test: 'element3',
                type: 'video',
                resource: {
                  type: 'video',
                  src: 'https://example.com/video.mp4',
                  poster: 'https://example.com/image.png',
                  posterId: 1,
                  id: 1,
                  mimeType: 'video/mp4',
                  width: 123,
                  height: 345,
                },
                backgroundOverlay: { r: 2, g: 2, b: 2 },
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
              type: 'image',
              resource: {
                type: 'image',
                mimeType: 'image/png',
                src: 'https://example.com/image.png',
                width: 123,
                height: 234,
              },
              x: 12,
              y: 34,
              width: 123,
              height: 345,
              fontSize: 16,
              overlay: { r: 1, g: 1, b: 1 },
            },
            {
              _test: 'element2',
              type: 'shape',
              x: 12,
              y: 34,
              width: 123,
              height: 345,
            },
          ],
        },
        {
          _test: 'page2',
          elements: [
            {
              _test: 'element3',
              type: 'video',
              resource: {
                type: 'video',
                src: 'https://example.com/video.mp4',
                poster: 'https://example.com/image.png',
                posterId: 1,
                id: 1,
                mimeType: 'video/mp4',
                width: 123,
                height: 345,
              },
              overlay: { r: 2, g: 2, b: 2 },
            },
          ],
        },
      ],
    });
  });
});
