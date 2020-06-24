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
import fetch from '../fetch';
import { listMedia } from '../apiFetcher';

jest.mock('../fetch');

const VALID_LIST_PHOTOS_RESPONSE = JSON.stringify({
  media: [
    {
      name: 'photo 29044',
      imageUrls: [
        {
          url:
            'https://upload.wikimedia.org/wikipedia/en/2/2e/Donald_Duck_-_temper.png',
          imageName: 'original',
        },
      ],
    },
  ],
});

describe('ApiFetcher', () => {
  const setup = function () {
    fetch.mockReset();
  };

  it('listMedia should perform a GET request', async () => {
    setup();
    fetch.mockImplementationOnce(() =>
      Promise.resolve(VALID_LIST_PHOTOS_RESPONSE)
    );

    const result = await listMedia();
    expect(result.media[0].name).toBe('photo 29044');
  });

  it('listMedia should format request params correctly', async () => {
    setup();
    fetch.mockImplementationOnce(() =>
      Promise.resolve(VALID_LIST_PHOTOS_RESPONSE)
    );
    const languageCode = 'es';
    const pageSize = 15;
    const orderBy = 'latest';
    const pageToken = '1234';
    const filter = 'cat';

    const result = await listMedia({
      languageCode,
      pageSize,
      orderBy,
      pageToken,
      filter,
    });
    expect(result.media[0].name).toBe('photo 29044');
    expect(fetch).toHaveBeenCalledTimes(1);
    const fetchArg = fetch.mock.calls[0][0];
    const queryString = fetchArg.substring(fetchArg.indexOf('?') + 1);
    const queryParams = queryString.split('&');
    expect(queryParams).toStrictEqual(
      expect.arrayContaining([
        'language_code=' + languageCode,
        'page_size=' + pageSize,
        'order_by=' + orderBy,
        'page_token=' + pageToken,
        'filter=' + filter,
      ])
    );
    expect(queryParams).toHaveLength(6); // Also includes the key
  });

  it('listMedia should throw an error for an invalid pageSize', async () => {
    expect.assertions(2);

    await expect(
      listMedia({
        pageSize: 'big',
      })
    ).rejects.toThrow(/Invalid page_size/);

    await expect(
      listMedia({
        pageSize: -30,
      })
    ).rejects.toThrow(/Invalid page_size/);
  });

  it('listMedia should throw an error for an invalid orderBy', async () => {
    expect.assertions(2);

    await expect(
      listMedia({
        orderBy: 'oldest',
      })
    ).rejects.toThrow(/Invalid order_by/);

    await expect(
      listMedia({
        orderBy: '',
      })
    ).rejects.toThrow(/Invalid order_by/);
  });
});
