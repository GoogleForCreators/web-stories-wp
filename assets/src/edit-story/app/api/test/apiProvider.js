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
import getAllTemplatesMock from '@web-stories-wp/templates';

/**
 * Internal dependencies
 */
import useAPI from '../useAPI';
import ApiProvider from '../apiProvider';
import { ConfigProvider } from '../../config';

jest.mock('../removeImagesFromPageLayouts');
import removeImagesFromPageLayouts from '../removeImagesFromPageLayouts';

import { GET_MEDIA_RESPONSE_HEADER, GET_MEDIA_RESPONSE_BODY } from './_utils';

jest.mock('@wordpress/api-fetch');
jest.mock('@web-stories-wp/templates');

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
    jest.clearAllMocks();

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
        postLock: { api: '' },
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

  it('getPageLayouts gets pageLayouts w/ cdnURL', async () => {
    const pageLayouts = [{ id: 'templateid' }];
    getAllTemplatesMock.mockReturnValue(pageLayouts);

    const cdnURL = 'https://test.url';
    const assetsURL = 'https://plugin.url/assets/';
    const { result } = renderApiProvider({
      configValue: {
        api: {},
        cdnURL,
        assetsURL,
        postLock: { api: '' },
      },
    });

    let pageLayoutsResult;
    await act(async () => {
      pageLayoutsResult = await result.current.actions.getPageLayouts({
        showImages: true,
      });
    });

    expect(removeImagesFromPageLayouts).toHaveBeenCalledWith({
      assetsURL,
      showImages: true,
      templates: pageLayouts,
    });
    expect(pageLayoutsResult).toStrictEqual(pageLayouts);
  });

  it('getPageLayouts gets pageLayouts w/ cdnURL and replaces images', async () => {
    const pageLayouts = [{ id: 'templateid' }];
    const formattedPageLayouts = [{ id: 'templateid', result: 'formatted' }];
    getAllTemplatesMock.mockReturnValue(pageLayouts);
    removeImagesFromPageLayouts.mockReturnValue(formattedPageLayouts);

    const cdnURL = 'https://test.url';
    const assetsURL = 'https://plugin.url/assets/';
    const { result } = renderApiProvider({
      configValue: {
        api: {},
        cdnURL,
        assetsURL,
        postLock: { api: '' },
      },
    });

    let pageLayoutsResult;
    await act(async () => {
      pageLayoutsResult = await result.current.actions.getPageLayouts();
    });

    expect(removeImagesFromPageLayouts).toHaveBeenCalledWith({
      assetsURL,
      showImages: false,
      templates: pageLayouts,
    });
    expect(pageLayoutsResult).toStrictEqual(formattedPageLayouts);
  });

  it('getPageLayouts should memoize the templates if they have already been fetched', async () => {
    const pageLayouts = [{ id: 'templateid' }];
    getAllTemplatesMock.mockReturnValue(pageLayouts);

    const cdnURL = 'https://test.url';
    const assetsURL = 'https://plugin.url/assets/';
    const { result } = renderApiProvider({
      configValue: {
        api: {},
        cdnURL,
        assetsURL,
        postLock: { api: '' },
      },
    });

    let pageLayoutsResult;
    await act(async () => {
      pageLayoutsResult = await result.current.actions.getPageLayouts({
        showImages: true,
      });
    });

    expect(getAllTemplatesMock).toHaveBeenCalledTimes(1);
    expect(pageLayoutsResult).toStrictEqual(pageLayouts);

    await act(async () => {
      pageLayoutsResult = await result.current.actions.getPageLayouts({
        showImages: true,
      });
    });

    expect(getAllTemplatesMock).toHaveBeenCalledTimes(1);
    expect(pageLayoutsResult).toStrictEqual(pageLayouts);
  });
});
