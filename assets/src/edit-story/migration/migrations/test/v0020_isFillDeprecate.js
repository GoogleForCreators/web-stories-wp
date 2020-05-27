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
import isFillDeprecate from '../v0020_isFillDeprecate';

const PAGE_WIDTH = 440;
const PAGE_HEIGHT = 660;
const FULLBLEED_RATIO = 9 / 16;
const FULLBLEED_HEIGHT = PAGE_WIDTH / FULLBLEED_RATIO;
const DANGER_ZONE_HEIGHT = (FULLBLEED_HEIGHT - PAGE_HEIGHT) / 2;

describe('isFillDeprecate', () => {
  it('should remove isFillBackground', () => {
    expect(
      isFillDeprecate({
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
                isFill: false,
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
                x: 12,
                y: 23,
                width: 123,
                height: 345,
                fontSize: 16,
                rotationAngle: 5,
                isFill: true,
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
              x: 0,
              y: -DANGER_ZONE_HEIGHT,
              width: PAGE_WIDTH,
              height: PAGE_WIDTH / FULLBLEED_RATIO,
              fontSize: 16,
              rotationAngle: 0,
            },
          ],
        },
      ],
    });
  });
});
