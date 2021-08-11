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
import wpAdapter from '../wpAdapter';

describe('wpAdapter', () => {
  afterEach(() => {
    global.fetch.mockClear();
  });

  it('calls fetch with options for GET request', () => {
    const mockFetchPromise = Promise.resolve({
      json: () => Promise.resolve({}),
    });

    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);

    wpAdapter.get('https://stories.google.com').catch(() => {});

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://stories.google.com?_locale=user',
      {
        credentials: 'include',
        headers: { Accept: 'application/json, */*;q=0.1' },
      }
    );
  });

  it('calls fetch with options for POST request', () => {
    const mockFetchPromise = Promise.resolve({
      json: () => Promise.resolve({}),
    });

    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);

    wpAdapter
      .post('https://stories.google.com', { data: 'Carlos' })
      .catch(() => {});

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://stories.google.com?_locale=user',
      {
        body: JSON.stringify('Carlos'),
        credentials: 'include',
        method: 'POST',
        headers: {
          Accept: 'application/json, */*;q=0.1',
          'Content-Type': 'application/json',
        },
      }
    );
  });

  it('calls fetch with options for DELETE request', () => {
    const mockFetchPromise = Promise.resolve({
      json: () => Promise.resolve({}),
    });

    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);

    wpAdapter.deleteRequest('https://stories.google.com').catch(() => {});

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://stories.google.com?_method=DELETE&_locale=user',
      {
        body: undefined,
        credentials: 'include',
        method: 'POST',
        headers: {
          Accept: 'application/json, */*;q=0.1',
        },
      }
    );
  });
});
