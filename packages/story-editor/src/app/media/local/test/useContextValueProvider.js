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
import ApiContext from '../../../api/context';
import useContextValueProvider from '../useContextValueProvider';
import {
  GET_MEDIA_RESPONSE_BODY,
  GET_MEDIA_RESPONSE_HEADER,
} from '../../../api/test/_utils';
import { ConfigProvider } from '../../../config';

jest.mock('../../useUploadMedia');
import useUploadMedia from '../../useUploadMedia';

jest.mock('../../utils/useUploadVideoFrame');
import useUploadVideoFrame from '../../utils/useUploadVideoFrame';

// Media List representation in state based on GET_MEDIA_RESPONSE_BODY.
const MEDIA_LIST_FROM_GET_MEDIA = [
  {
    type: 'image',
    mimeType: 'image/jpeg',
    output: undefined,
    creationDate: '2020-09-01T05:33:54',
    src: 'http://wp.local/wp-content/uploads/2020/09/IMAGE.jpg',
    width: 1080,
    height: 2220,
    poster: undefined,
    posterId: undefined,
    baseColor: '#ffffff',
    id: 274,
    length: undefined,
    lengthFormatted: undefined,
    alt: 'IMAGE',
    isPlaceholder: false,
    isMuted: false,
    isOptimized: false,
    isExternal: false,
    sizes: {
      medium: {
        file: 'IMAGE-146x300.jpg',
        width: 146,
        height: 300,
        mimeType: 'image/jpeg',
        sourceUrl:
          'http://wp.local/wp-content/uploads/2020/09/IMAGE-146x300.jpg',
      },
      large: {
        file: 'IMAGE-498x1024.jpg',
        width: 498,
        height: 1024,
        mimeType: 'image/jpeg',
        sourceUrl:
          'http://wp.local/wp-content/uploads/2020/09/IMAGE-498x1024.jpg',
      },
      thumbnail: {
        file: 'IMAGE-150x150.jpg',
        width: 150,
        height: 150,
        mimeType: 'image/jpeg',
        sourceUrl:
          'http://wp.local/wp-content/uploads/2020/09/IMAGE-150x150.jpg',
      },
      medium_large: {
        file: 'IMAGE-768x1579.jpg',
        width: 768,
        height: 1579,
        mimeType: 'image/jpeg',
        sourceUrl:
          'http://wp.local/wp-content/uploads/2020/09/IMAGE-768x1579.jpg',
      },
      '1536x1536': {
        file: 'IMAGE-747x1536.jpg',
        width: 747,
        height: 1536,
        mimeType: 'image/jpeg',
        sourceUrl:
          'http://wp.local/wp-content/uploads/2020/09/IMAGE-747x1536.jpg',
      },
      '2048x2048': {
        file: 'IMAGE-996x2048.jpg',
        width: 996,
        height: 2048,
        mimeType: 'image/jpeg',
        sourceUrl:
          'http://wp.local/wp-content/uploads/2020/09/IMAGE-996x2048.jpg',
      },
      'web-stories-poster-portrait': {
        file: 'IMAGE-640x853.jpg',
        width: 640,
        height: 853,
        mimeType: 'image/jpeg',
        sourceUrl:
          'http://wp.local/wp-content/uploads/2020/09/IMAGE-640x853.jpg',
      },
      'web-stories-publisher-logo': {
        file: 'IMAGE-96x96.jpg',
        width: 96,
        height: 96,
        mimeType: 'image/jpeg',
        sourceUrl: 'http://wp.local/wp-content/uploads/2020/09/IMAGE-96x96.jpg',
      },
      'web-stories-thumbnail': {
        file: 'IMAGE-150x308.jpg',
        width: 150,
        height: 308,
        mimeType: 'image/jpeg',
        sourceUrl:
          'http://wp.local/wp-content/uploads/2020/09/IMAGE-150x308.jpg',
      },
      full: {
        file: 'IMAGE.jpg',
        width: 1080,
        height: 2220,
        mimeType: 'image/jpeg',
        sourceUrl: 'http://wp.local/wp-content/uploads/2020/09/IMAGE.jpg',
      },
    },
    attribution: undefined,
  },
];

const renderAllProviders = ({
  reducerState,
  reducerActions,
  configState,
  apiState,
}) =>
  renderHook(() => useContextValueProvider(reducerState, reducerActions), {
    wrapper: ({ children }) => (
      <ConfigProvider config={configState}>
        <ApiContext.Provider value={apiState}>{children}</ApiContext.Provider>
      </ConfigProvider>
    ),
  });

describe('useContextValueProvider', () => {
  let reducerState;
  let reducerActions;
  beforeEach(() => {
    reducerState = {
      audioProcessing: [],
      audioProcessed: [],
      posterProcessing: [],
      posterProcessed: [],
      media: [],
      pageToken: '',
      mediaType: '',
      searchTerm: '',
      totalItems: 0,
    };
    reducerActions = {
      fetchMediaStart: jest.fn(),
      fetchMediaSuccess: jest.fn(),
      fetchMediaError: jest.fn(),
      resetFilters: jest.fn(),
      setMedia: jest.fn(),
      setMediaType: jest.fn(),
      setSearchTerm: jest.fn(),
      setNextPage: jest.fn(),
      setAudioProcessing: jest.fn(),
      removeAudioProcessing: jest.fn(),
      setPosterProcessing: jest.fn(),
      removePosterProcessing: jest.fn(),
      updateMediaElement: jest.fn(),
      deleteMediaElement: jest.fn(),
    };

    const useUploadMediaResult = {
      uploadMedia: jest.fn(),
      isUploading: jest.fn(),
    };
    useUploadMedia.mockImplementation(() => useUploadMediaResult);

    const useUploadVideoFrameResult = {
      uploadVideoFrame: jest.fn(),
    };
    useUploadVideoFrame.mockImplementation(() => useUploadVideoFrameResult);
  });

  it('resetWithFetch calls getMedia with cacheBust:true and then fetchMediaSuccess', async () => {
    // Set up and make initial call to useContextValueProvider (which calls
    // getMedia and fetchMediaSuccess once). Sets an empty media state.
    const getMedia = jest.fn(() =>
      Promise.resolve({
        data: [],
        headers: GET_MEDIA_RESPONSE_HEADER,
      })
    );
    const apiState = {
      actions: {
        getMedia,
      },
    };
    const configState = {
      api: {},
      allowedMimeTypes: {
        image: [],
        vector: [],
        video: [],
        caption: [],
        audio: [],
      },
      capabilities: { hasUploadMediaAction: true },
    };
    const { result } = renderAllProviders({
      reducerState,
      reducerActions,
      configState,
      apiState,
    });

    // This promise will only complete when the "done()" callback is called
    // (see reducerActions.fetchMediaSuccess mock implementation in Promise).
    await new Promise((done) => {
      getMedia.mockImplementation(() => {
        return Promise.resolve({
          data: GET_MEDIA_RESPONSE_BODY,
          headers: GET_MEDIA_RESPONSE_HEADER,
        });
      });
      reducerActions.fetchMediaSuccess.mockImplementation(() => {
        done();
      });

      // Act:
      result.current.actions.resetWithFetch();
    });

    // Assert after fetchMediaSuccess callback is called:
    expect(getMedia).toHaveBeenNthCalledWith(2, {
      mediaType: '',
      searchTerm: '',
      pagingNum: 1,
    });

    expect(reducerActions.fetchMediaSuccess).toHaveBeenNthCalledWith(2, {
      media: MEDIA_LIST_FROM_GET_MEDIA,
      mediaType: '',
      searchTerm: '',
      pageToken: 1,
      nextPageToken: undefined,
      totalPages: 1,
      totalItems: 1,
    });
  });
});
