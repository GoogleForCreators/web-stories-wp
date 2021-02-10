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
import oneTapLinkDeprecate from '../v0014_oneTapLinkDeprecate';

describe('oneTapLinkDeprecate', () => {
  it('should remove link type', () => {
    expect(
      oneTapLinkDeprecate({
        _test: 'story',
        pages: [
          {
            _test: 'page1',
            elements: [
              {
                _test: 'element1',
                type: 'square',
                x: 10,
                y: 20,
                width: 100,
                height: 200,
                link: {
                  type: 1,
                  url: 'https://example.com/',
                },
              },
              {
                _test: 'element2',
                type: 'image',
                resource: {
                  type: 'image',
                  mimeType: 'image/png',
                  src: 'https://example.com/image.png',
                  width: 265,
                  height: 527,
                },
                x: 29,
                y: 55,
                width: 265,
                height: 527,
                fontSize: 58,
                link: {
                  type: 2,
                  url: 'https://example.com/',
                },
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
                  posterId: 100002,
                  id: 102113,
                  mimeType: 'video/mp4',
                  width: 265,
                  height: 527,
                },
                x: 29,
                y: 55,
                width: 265,
                height: 527,
                fontSize: 58,
                link: {
                  type: 1,
                  url: 'https://example.com/',
                  image: 'https://example.com/image.png',
                },
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
              type: 'square',
              x: 10,
              y: 20,
              width: 100,
              height: 200,
              link: {
                url: 'https://example.com/',
              },
            },
            {
              _test: 'element2',
              type: 'image',
              resource: {
                type: 'image',
                mimeType: 'image/png',
                src: 'https://example.com/image.png',
                width: 265,
                height: 527,
              },
              x: 29,
              y: 55,
              width: 265,
              height: 527,
              fontSize: 58,
              link: {
                url: 'https://example.com/',
              },
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
                posterId: 100002,
                id: 102113,
                mimeType: 'video/mp4',
                width: 265,
                height: 527,
              },
              x: 29,
              y: 55,
              width: 265,
              height: 527,
              fontSize: 58,
              link: {
                url: 'https://example.com/',
                image: 'https://example.com/image.png',
              },
            },
          ],
        },
      ],
    });
  });
});
