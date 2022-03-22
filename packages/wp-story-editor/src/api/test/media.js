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
 * External dependencies
 */
import { bindToCallbacks } from '@web-stories-wp/wp-utils';

/**
 * Internal dependencies
 */
import * as apiCallbacks from '..';
import { flattenFormData } from '../utils';
import { GET_MEDIA_RESPONSE_HEADER, GET_MEDIA_RESPONSE_BODY } from './_utils';

jest.mock('@wordpress/api-fetch');

describe('Media API Callbacks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const MEDIA_PATH = `/web-stories/v1/media/`;

  it('getMedia with cacheBust:true should call api with &cache_bust=true', () => {
    apiFetch.mockReturnValue(
      Promise.resolve({
        body: GET_MEDIA_RESPONSE_BODY,
        headers: GET_MEDIA_RESPONSE_HEADER,
      })
    );
    const { getMedia } = bindToCallbacks(apiCallbacks, {
      api: { media: MEDIA_PATH },
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

  it('updateMedia maps arguments to expected format', () => {
    apiFetch.mockReturnValue(Promise.resolve(GET_MEDIA_RESPONSE_BODY[0]));
    const { updateMedia } = bindToCallbacks(apiCallbacks, {
      api: { media: MEDIA_PATH },
    });

    const mediaId = 1;
    const mockData = {
      baseColor: '#123456',
      blurHash: 'asdafd-dsfgh',
      isMuted: false,
      mediaSource: 'source-video',
      optimizedId: 12,
      mutedId: 13,
      altText: 'New Alt Text',
      storyId: 11,
      posterId: 14,
    };
    const expectedWpKeysMapping = {
      meta: {
        web_stories_base_color: mockData.baseColor,
        web_stories_blurhash: mockData.blurHash,
        web_stories_optimized_id: mockData.optimizedId,
        web_stories_muted_id: mockData.mutedId,
        web_stories_poster_id: mockData.posterId,
      },
      web_stories_is_muted: mockData.isMuted,
      web_stories_media_source: mockData.mediaSource,
      post: mockData.storyId,
      featured_media: mockData.posterId,
      alt_text: mockData.altText,
    };

    updateMedia(mediaId, mockData);

    expect(apiFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        path: MEDIA_PATH + `${mediaId}/`,
        method: 'POST',
        data: expectedWpKeysMapping,
      })
    );
  });

  it('uploadMedia maps arguments to expected format', () => {
    apiFetch.mockReturnValue(Promise.resolve(GET_MEDIA_RESPONSE_BODY[0]));
    const { uploadMedia } = bindToCallbacks(apiCallbacks, {
      api: { media: MEDIA_PATH },
    });

    const file = new File([''], 'filename');

    const mockData = {
      originalId: 11,
      templateId: 12,
      isMuted: false,
      mediaSource: 'source-video',
      trimData: { data: 'trimData' },
      baseColor: '#123456',
      blurHash: 'asdafd-dsfgh',
    };
    const expectedWpKeysMapping = {
      web_stories_media_source: mockData.mediaSource,
      web_stories_is_muted: mockData.isMuted,
      post: mockData.templateId,
      original_id: mockData.originalId,
      web_stories_trim_data: mockData.trimData,
      web_stories_base_color: mockData.baseColor,
      web_stories_blurhash: mockData.blurHash,
    };

    const expectedDataArgument = new window.FormData();
    expectedDataArgument.append(
      'file',
      file,
      // eslint-disable-next-line jest/no-conditional-in-test
      file.name || file.type.replace('/', '.')
    );

    Object.entries(expectedWpKeysMapping).forEach(([key, value]) =>
      flattenFormData(expectedDataArgument, key, value)
    );

    uploadMedia(file, mockData);

    expect(apiFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        path: MEDIA_PATH,
        method: 'POST',
        body: expectedDataArgument,
      })
    );
  });
});
