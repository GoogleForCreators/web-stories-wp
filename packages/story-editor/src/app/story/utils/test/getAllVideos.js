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
 * External dependencies
 */
import { ELEMENT_TYPES } from '@googleforcreators/elements';
/**
 * Internal dependencies
 */
import getAllVideos from '../getAllVideos';

describe('getAllVideos', () => {
  it('should return empty array', () => {
    expect(getAllVideos([])).toStrictEqual([]);
  });

  it('should return empty array as type not video', () => {
    expect(
      getAllVideos([
        {
          elements: [
            {
              type: ELEMENT_TYPES.TEXT,
              content: '<span style="font-style: italic">Hello</span>',
            },
          ],
        },
      ])
    ).toStrictEqual([]);
  });

  it('should return a video', () => {
    expect(
      getAllVideos([
        {
          elements: [
            {
              type: ELEMENT_TYPES.VIDEO,
              resource: {
                id: 123,
                src: 'http://www.example.com/test.mp4',
                poster: 'http://www.example.com/test.jpg',
                isExternal: false,
                length: 60,
                creationDate: '2022-09-28T15:46:03',
                alt: 'Foo',
              },
            },
            {
              type: ELEMENT_TYPES.TEXT,
              content: '<span style="font-style: italic">Hello</span>',
            },
          ],
        },
      ])
    ).toStrictEqual([
      {
        src: 'http://www.example.com/test.mp4',
        poster: 'http://www.example.com/test.jpg',
        length: 60,
        creationDate: '2022-09-28T15:46:03',
        alt: 'Foo',
      },
    ]);
  });

  it('should return unique videos', () => {
    expect(
      getAllVideos([
        {
          elements: [
            {
              type: ELEMENT_TYPES.VIDEO,
              resource: {
                id: 123,
                src: 'http://www.example.com/test.mp4',
                poster: 'http://www.example.com/test.jpg',
                isExternal: false,
                length: 60,
                creationDate: '2022-09-28T15:46:03',
                alt: 'Foo',
              },
            },
            {
              type: ELEMENT_TYPES.VIDEO,
              resource: {
                id: 456,
                src: 'http://www.example.com/test1.mp4',
                poster: 'http://www.example.com/test1.jpg',
                isExternal: false,
                length: 30,
                creationDate: '2022-08-28T15:46:03',
                alt: 'Bar',
              },
            },
            {
              type: ELEMENT_TYPES.TEXT,
              content: '<span style="font-style: italic">Hello</span>',
            },
          ],
        },
        {
          elements: [
            {
              type: ELEMENT_TYPES.VIDEO,
              resource: {
                id: 123,
                src: 'http://www.example.com/test.mp4',
                poster: 'http://www.example.com/test.jpg',
                isExternal: false,
                length: 60,
                creationDate: '2022-09-28T15:46:03',
                alt: 'Foo',
              },
            },
          ],
        },
      ])
    ).toStrictEqual([
      {
        src: 'http://www.example.com/test.mp4',
        poster: 'http://www.example.com/test.jpg',
        length: 60,
        creationDate: '2022-09-28T15:46:03',
        alt: 'Foo',
      },
      {
        src: 'http://www.example.com/test1.mp4',
        poster: 'http://www.example.com/test1.jpg',
        length: 30,
        creationDate: '2022-08-28T15:46:03',
        alt: 'Bar',
      },
    ]);
  });

  it('should return only local videos', () => {
    expect(
      getAllVideos([
        {
          elements: [
            {
              type: ELEMENT_TYPES.VIDEO,
              resource: {
                id: 123,
                src: 'http://www.example.com/test.mp4',
                poster: 'http://www.example.com/test.jpg',
                isExternal: true,
                length: 60,
                creationDate: '2022-09-28T15:46:03',
                alt: 'Foo',
              },
            },
            {
              type: ELEMENT_TYPES.VIDEO,
              resource: {
                id: 456,
                src: 'http://www.example.com/test1.mp4',
                poster: 'http://www.example.com/test1.jpg',
                isExternal: false,
                length: 30,
                creationDate: '2022-08-28T15:46:03',
                alt: 'Bar',
              },
            },
            {
              type: ELEMENT_TYPES.TEXT,
              content: '<span style="font-style: italic">Hello</span>',
            },
          ],
        },
      ])
    ).toStrictEqual([
      {
        src: 'http://www.example.com/test1.mp4',
        poster: 'http://www.example.com/test1.jpg',
        length: 30,
        creationDate: '2022-08-28T15:46:03',
        alt: 'Bar',
      },
    ]);
  });
});
