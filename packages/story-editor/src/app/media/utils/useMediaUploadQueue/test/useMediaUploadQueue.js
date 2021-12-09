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
import { isAnimatedGif } from '@web-stories-wp/media';

/**
 * Internal dependencies
 */
import useMediaUploadQueue from '..';
import useFFmpeg from '../../useFFmpeg';

const canTranscodeFile = (file) => {
  return ['video/mp4'].includes(file.type);
};

const waitfor10 = async () => {
  const file = new File(['foo'], 'foo.mp4', {
    type: 'video/mp4',
    size: 5000,
  });
  await new Promise((res) => setTimeout(() => res(file), 10));
};

jest.mock('../../useFFmpeg', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    isTranscodingEnabled: true,
    canTranscodeFile,
    isFileTooLarge: jest.fn(),
    transcodeVideo: waitfor10,
    stripAudioFromVideo: waitfor10,
    trimVideo: waitfor10,
    getFirstFrameOfVideo: jest.fn(),
    convertGifToVideo: waitfor10,
  })),
}));

jest.mock('@web-stories-wp/media', () => ({
  ...jest.requireActual('@web-stories-wp/media'),
  isAnimatedGif: jest.fn(),
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
  beforeEach(() => {
    isAnimatedGif.mockReturnValue(false);
  });

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
        finished: [],
        progress: [],
        isUploading: false,
        isTranscoding: false,
        isMuting: false,
        isTrimming: false,
        isNewResourceMuting: expect.any(Function),
        isCurrentResourceMuting: expect.any(Function),
        isNewResourceProcessing: expect.any(Function),
        isCurrentResourceProcessing: expect.any(Function),
        isNewResourceTranscoding: expect.any(Function),
        isCurrentResourceTranscoding: expect.any(Function),
        isResourceTrimming: expect.any(Function),
        isCurrentResourceTrimming: expect.any(Function),
        isCurrentResourceUploading: expect.any(Function),
        canTranscodeResource: expect.any(Function),
      })
    );
  });

  it('should set isUploading state when adding an item to the queue', async () => {
    const file = new File(['foo'], 'foo.jpg', {
      type: 'image/jpeg',
      size: 1000,
    });

    const { result, waitForNextUpdate, waitFor } = renderHook(() =>
      useMediaUploadQueue()
    );

    expect(result.current.state.isUploading).toBeFalse();

    act(() => result.current.actions.addItem({ file, resource: mockResource }));

    expect(result.current.state.isUploading).toBeTrue();

    const {
      resource: { id: resourceId },
    } = result.current.state.progress[0];
    expect(
      result.current.state.isCurrentResourceProcessing(resourceId)
    ).toBeFalse();
    expect(
      result.current.state.isCurrentResourceUploading(resourceId)
    ).toBeTrue();

    await waitForNextUpdate();

    await waitFor(() => {
      expect(result.current.state.uploaded).toHaveLength(1);
    });

    expect(result.current.state.isUploading).toBeTrue();

    const { id } = result.current.state.uploaded[0];

    act(() => result.current.actions.finishItem({ id }));

    expect(result.current.state.isUploading).toBeFalse();
    expect(result.current.state.uploaded).toHaveLength(0);
    expect(result.current.state.finished).toHaveLength(1);

    act(() => result.current.actions.removeItem({ id }));

    expect(result.current.state.isUploading).toBeFalse();
    expect(result.current.state.finished).toHaveLength(0);
  });

  it('should set isUploading state when adding a gif item to the queue', async () => {
    isAnimatedGif.mockReturnValue(true);
    const file = {
      type: 'image/gif',
      size: 1000,
      arrayBuffer: () => true,
    };

    const resource = {
      id: 123,
      mimeType: 'image/gif',
    };

    const { result, waitFor } = renderHook(() => useMediaUploadQueue());

    expect(result.current.state.isUploading).toBeFalse();

    act(() => result.current.actions.addItem({ file, resource }));

    const {
      resource: { id: resourceId },
    } = result.current.state.pending[0];

    await waitFor(() => expect(result.current.state.isTranscoding).toBeTrue());

    expect(
      result.current.state.isCurrentResourceTranscoding(resourceId)
    ).toBeTrue();
  });

  it('should set isTrancoding state when adding an item to the queue', async () => {
    const file = new File(['foo'], 'foo.mp4', {
      type: 'video/mp4',
      size: 5000,
    });

    const { result, waitFor } = renderHook(() => useMediaUploadQueue());

    expect(result.current.state.isUploading).toBeFalse();

    act(() => result.current.actions.addItem({ file, resource: mockResource }));

    const {
      resource: { id: resourceId },
    } = result.current.state.progress[0];

    await waitFor(() => expect(result.current.state.isTranscoding).toBeTrue());

    expect(
      result.current.state.isCurrentResourceProcessing(resourceId)
    ).toBeTrue();
    expect(
      result.current.state.isCurrentResourceTranscoding(resourceId)
    ).toBeTrue();

    expect(result.current.state.isNewResourceProcessing(123)).toBeFalse();
    expect(result.current.state.isNewResourceTranscoding(123)).toBeFalse();
  });

  it('should set isMuting state when adding an item to the queue', async () => {
    const file = new File(['foo'], 'foo.mp4', {
      type: 'video/mp4',
      size: 5000,
    });

    const { result, waitFor } = renderHook(() => useMediaUploadQueue());

    expect(result.current.state.isUploading).toBeFalse();

    act(() =>
      result.current.actions.addItem({
        file,
        resource: mockResource,
        muteVideo: true,
      })
    );

    const {
      resource: { id: resourceId },
    } = result.current.state.progress[0];
    await waitFor(() => expect(result.current.state.isMuting).toBeTrue());

    expect(
      result.current.state.isCurrentResourceProcessing(resourceId)
    ).toBeTrue();
    expect(result.current.state.isCurrentResourceMuting(resourceId)).toBeTrue();

    expect(result.current.state.isNewResourceProcessing(123)).toBeFalse();
    expect(result.current.state.isNewResourceMuting(123)).toBeFalse();
  });

  it('should set isTrimming state when adding an item to the queue', async () => {
    const file = new File(['foo'], 'foo.mp4', {
      type: 'video/mp4',
      size: 5000,
    });

    const { result, waitFor } = renderHook(() => useMediaUploadQueue());

    expect(result.current.state.isUploading).toBeFalse();

    act(() =>
      result.current.actions.addItem({
        file,
        resource: mockResource,
        trimData: { start: 100 },
      })
    );

    const {
      resource: { id: resourceId },
    } = result.current.state.progress[0];

    await waitFor(() => expect(result.current.state.isTrimming).toBeTrue());

    expect(
      result.current.state.isCurrentResourceProcessing(resourceId)
    ).toBeTrue();
    expect(
      result.current.state.isCurrentResourceTrimming(resourceId)
    ).toBeTrue();

    expect(result.current.state.isNewResourceProcessing(123)).toBeFalse();
    expect(result.current.state.isResourceTrimming(123)).toBeFalse();
  });

  it('allows removing items from the queue', async () => {
    const file = {
      type: 'image/jpg',
      size: 1000,
    };

    const { result, waitFor, waitForNextUpdate } = renderHook(() =>
      useMediaUploadQueue()
    );

    act(() => result.current.actions.addItem({ file, resource: mockResource }));

    await waitForNextUpdate();

    expect(result.current.state.failures).toHaveLength(0);
    expect(result.current.state.uploaded).toHaveLength(1);

    act(() =>
      result.current.actions.finishItem({
        id: result.current.state.uploaded[0].id,
      })
    );

    expect(result.current.state.finished).toHaveLength(1);

    act(() =>
      result.current.actions.removeItem({
        id: result.current.state.finished[0].id,
      })
    );

    await waitFor(() =>
      expect(result.current.state).toStrictEqual({
        pending: [],
        failures: [],
        finished: [],
        uploaded: [],
        progress: [],
        isUploading: false,
        isTranscoding: false,
        isMuting: false,
        isTrimming: false,
        isNewResourceMuting: expect.any(Function),
        isCurrentResourceMuting: expect.any(Function),
        isNewResourceProcessing: expect.any(Function),
        isCurrentResourceProcessing: expect.any(Function),
        isNewResourceTranscoding: expect.any(Function),
        isCurrentResourceTranscoding: expect.any(Function),
        isResourceTrimming: expect.any(Function),
        isCurrentResourceTrimming: expect.any(Function),
        isCurrentResourceUploading: expect.any(Function),
        canTranscodeResource: expect.any(Function),
      })
    );
  });
});
