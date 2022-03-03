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
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
/**
 * External dependencies
 */
import { bindToCallbacks } from '@web-stories-wp/wp-utils';
import * as apiCallbacks from '..';
import { GET_MEDIA_RESPONSE_HEADER, GET_MEDIA_RESPONSE_BODY } from './_utils';

jest.mock('@wordpress/api-fetch');

describe('Media API Callbacks', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    apiFetch.mockReturnValue(
      Promise.resolve({
        body: GET_MEDIA_RESPONSE_BODY,
        headers: GET_MEDIA_RESPONSE_HEADER,
      })
    );
  });

  it('getMedia with cacheBust:true should call api with &cache_bust=true', () => {
    const { getMedia } = bindToCallbacks(apiCallbacks, {
      api: { media: '/web-stories/v1/media/' },
    });
    getMedia({
      mediaType: '',
      searchTerm: '',
      pagingNum: 1,
      cacheBust: true,
    });

    expect(apiFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        path: expect.stringMatching('&cache_bust=true'),
      })
    );
  });
});
