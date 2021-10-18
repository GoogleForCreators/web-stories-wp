/*
 * Copyright 2021 Google LLC
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
import { renderHook, act } from '@testing-library/react-hooks';

/**
 * Internal dependencies
 */
import useMediaUploadQueue from '..';
import useFFmpeg from '../../useFFmpeg';

jest.mock('../../useFFmpeg', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    isTranscodingEnabled: true,
    canTranscodeFile: jest.fn(),
    isFileTooLarge: jest.fn(),
    transcodeVideo: jest.fn(),
    stripAudioFromVideo: jest.fn(),
    getFirstFrameOfVideo: jest.fn(),
    convertGifToVideo: jest.fn(),
  })),
}));

// todo: update to be resource object.
const mockResource = {
  id: 123,
  guid: {
    rendered: 'guid-123',
  },
  media_details: {
    width: 1080,
    height: 720,
  },
  source_url: 'http://localhost:9876/__static__/asteroid.ogg',
  title: {
    raw: 'Title',
  },
  description: {
    raw: 'Description',
  },
  featured_media_src: {},
  meta: {
    web_stories_is_poster: false,
    web_stories_poster_id: 0,
    web_stories_trim_data: {},
  },
  web_stories_is_muted: false,
};

const mockUploadFile = jest
  .fn()
  .mockImplementation(() => Promise.resolve(mockResource));

jest.mock('../../../../uploader', () => ({
  useUploader: jest.fn(() => ({
    actions: {
      uploadFile: mockUploadFile,
    },
    state: {
      isTranscoding: false,
    },
  })),
}));

describe('useMediaUploadQueue', () => {
  afterEach(() => {
    useFFmpeg.mockClear();
  });

  it('sets initial state for upload queue', async () => {
    const { result, waitFor } = renderHook(() => useMediaUploadQueue());

    await waitFor(() =>
      expect(result.current.state).toStrictEqual({
        pending: [],
        failures: [],
        uploaded: [],
        progress: [],
        isUploading: false,
        isTranscoding: false,
        isMuting: false,
        isTrimming: false,
      })
    );
  });

  it('should set isUploading state when adding an item to the queue', async () => {
    const file = new File(['foo'], 'foo.mov', {
      type: 'video/quicktime',
    });

    const { result, waitForNextUpdate } = renderHook(() =>
      useMediaUploadQueue()
    );

    expect(result.current.state.isUploading).toBeFalse();

    act(() => result.current.actions.addItem({ file }));

    expect(result.current.state.isUploading).toBeTrue();

    await waitForNextUpdate();

    expect(result.current.state.isUploading).toBeFalse();
    expect(result.current.state.uploaded).toHaveLength(1);

    const { id } = result.current.state.uploaded[0];

    act(() => result.current.actions.removeItem({ id }));

    expect(result.current.state.isUploading).toBeFalse();
    expect(result.current.state.uploaded).toHaveLength(0);
  });

  it('allows removing items from the queue', async () => {
    const file = new File(['foo'], 'foo.mov', {
      type: 'video/quicktime',
    });

    const { result, waitFor, waitForNextUpdate } = renderHook(() =>
      useMediaUploadQueue()
    );

    act(() => result.current.actions.addItem({ file }));

    await waitForNextUpdate();

    expect(result.current.state.failures).toHaveLength(0);
    expect(result.current.state.uploaded).toHaveLength(1);

    act(() =>
      result.current.actions.removeItem({
        id: result.current.state.uploaded[0].id,
      })
    );

    await waitFor(() =>
      expect(result.current.state).toStrictEqual({
        pending: [],
        failures: [],
        uploaded: [],
        progress: [],
        isUploading: false,
        isTranscoding: false,
        isMuting: false,
        isTrimming: false,
      })
    );
  });
});
