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
import { renderHook } from '@testing-library/react-hooks';

/**
 * Internal dependencies
 */
import { useMedia3pApi } from '../index';
import Media3pApiProvider from '../media3pApiProvider';

jest.mock('../apiFetcher', () => ({
  listMedia: () =>
    Promise.resolve({
      media: [
        {
          name: 'media/unsplash:1234',
          provider: 'UNSPLASH',
          author: {
            displayName: 'Maria',
            url: 'http://maria.com',
          },
          imageUrls: [
            {
              imageName: 'full',
              url: 'http://www.img.com',
              width: 200,
              height: 100,
              mimeType: 'image/png',
            },
          ],
          description: 'A cat',
          type: 'IMAGE',
          createTime: '1234',
          updateTime: '5678',
        },
      ],
      nextPageToken: 'lala',
    }),
}));

describe('useMedia3pApi', () => {
  it('should properly call listMedia and map the results', async () => {
    const wrapper = (params) => (
      <Media3pApiProvider>{params.children}</Media3pApiProvider>
    );
    const { result } = renderHook(() => useMedia3pApi(), { wrapper });

    const listMediaResult = await result.current.actions.listMedia({
      provider: 'unsplash',
    });

    expect(listMediaResult).toStrictEqual({
      media: [
        {
          alt: null,
          attribution: {
            author: {
              displayName: 'Maria',
              url: 'http://maria.com',
            },
          },
          creationDate: '1234',
          height: 100,
          id: 'media/unsplash:1234',
          length: null,
          lengthFormatted: null,
          local: false,
          mimeType: 'image/png',
          poster: null,
          posterId: null,
          sizes: {
            full: {
              file: 'media/unsplash:1234',
              source_url: 'http://www.img.com',
              mime_type: 'image/png',
              width: 200,
              height: 100,
            },
          },
          src: 'http://www.img.com',
          title: 'A cat',
          type: 'image',
          width: 200,
        },
      ],
      nextPageToken: 'lala',
    });
  });
});
