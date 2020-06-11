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
import { act, renderHook } from '@testing-library/react-hooks';
/**
 * Internal dependencies
 */
import useTagsApi from '../useTagsApi';
import wpAdapter from '../wpAdapter';

jest.mock('../wpAdapter', () => ({
  get: () =>
    Promise.resolve({
      headers: {
        get: () => '1',
      },
      json: () =>
        Promise.resolve([
          {
            id: 7,
            name: 'Fun',
            slug: 'fun',
          },
        ]),
    }),
}));

describe('useTagsApi', () => {
  it('should return tags in state data when the API request is fired', async () => {
    const { result } = renderHook(() =>
      useTagsApi(wpAdapter, { tagsApi: 'tags' })
    );

    await act(async () => {
      await result.current.api.fetchTags();
    });

    expect(result.current.tags).toStrictEqual({
      7: {
        id: 7,
        name: 'Fun',
        slug: 'fun',
      },
    });
  });
});
