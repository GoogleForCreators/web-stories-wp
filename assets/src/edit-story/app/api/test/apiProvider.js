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
import { act, renderHook } from '@testing-library/react-hooks';

/**
 * Internal dependencies
 */
import useAPI from '../useAPI';
import ApiProvider from '../apiProvider';
import { ConfigProvider } from '../../config';

jest.mock('../../../../dashboard/templates');
import getAllTemplates from '../../../../dashboard/templates';

import { GET_MEDIA_RESPONSE_HEADER, GET_MEDIA_RESPONSE_BODY } from './_utils';

jest.mock('@wordpress/api-fetch');

const renderApiProvider = ({ configValue }) => {
  return renderHook(() => useAPI(), {
    // eslint-disable-next-line react/display-name
    wrapper: (props) => (
      <ConfigProvider config={configValue}>
        <ApiProvider {...props} />
      </ConfigProvider>
    ),
  });
};

describe('APIProvider', () => {
  beforeEach(() => {
    apiFetch.mockReturnValue(
      Promise.resolve({
        body: GET_MEDIA_RESPONSE_BODY,
        headers: GET_MEDIA_RESPONSE_HEADER,
      })
    );
  });

  it('getMedia with cacheBust:true should call api with &cache_bust=true', () => {
    const { result } = renderApiProvider({
      configValue: {
        api: {
          media: 'mediaPath',
        },
      },
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

  it('getTemplates gets templates w/ cdnURL', async () => {
    const templates = [{ id: 'templateid' }];
    getAllTemplates.mockResolvedValue(templates);

    const cdnURL = 'https://test.url';
    const { result } = renderApiProvider({
      configValue: {
        api: {},
        cdnURL,
      },
    });

    let templatesResult;
    await act(async () => {
      templatesResult = await result.current.actions.getTemplates();
    });

    expect(getAllTemplates).toHaveBeenCalledWith({ cdnURL });
    expect(templatesResult).toStrictEqual(templates);
  });
});
