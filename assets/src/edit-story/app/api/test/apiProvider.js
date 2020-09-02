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

/**
 * External dependencies
 */
import { act, renderHook } from '@testing-library/react-hooks';

jest.mock('@wordpress/api-fetch');
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import useAPI from '../useAPI';
import ApiProvider from '../apiProvider';
import { ConfigProvider } from '../../config';
import {
  GET_MEDIA_RESPONSE_HEADER,
  GET_MEDIA_RESPONSE_BODY,
} from './sampleApiResponses';

describe('apiProvider', () => {
  beforeEach(() => {
    apiFetch.mockImplementation(() => {
      return Promise.resolve({
        body: GET_MEDIA_RESPONSE_BODY,
        headers: GET_MEDIA_RESPONSE_HEADER,
      });
    });
  });

  it('when getMedia called with cacheBust:true, should call api with &cache_bust=true', () => {
    const { result } = renderHook(() => useAPI(), {
      // eslint-disable-next-line react/display-name
      wrapper: (props) => (
        <ConfigProvider
          config={{
            api: {
              media: 'mediaPath',
            },
          }}
        >
          <ApiProvider {...props} />
        </ConfigProvider>
      ),
    });

    act(() => {
      result.current.actions.getMedia({
        mediaType: '',
        searchTerm: '',
        pagingNum: 1,
        cacheBust: true,
      });
    });

    expect(apiFetch).toHaveBeenCalledWith({
      path:
        '/mediaPath?context=edit&per_page=100&page=1&_web_stories_envelope=true&cache_bust=true',
    });
  });
});
