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
import { isAnimatedGif, createResource } from '@googleforcreators/media';

/**
 * Internal dependencies
 */
import useMediaUploadQueue from '..';
import useFFmpeg from '../../useFFmpeg';
import useMediaInfo from '../../useMediaInfo';
import { ITEM_STATUS } from '../constants';

const canTranscodeFile = (file) => {
  return ['video/mp4'].includes(file.type);
};

const getFileWithSleep = () => {
  const file = new File(['foo'], 'foo.mp4', {
    type: 'video/mp4',
    size: 5000,
  });
  return new Promise((res) => setTimeout(() => res(file), 10));
};

jest.mock('../../useFFmpeg', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    isTranscodingEnabled: true,
    canTranscodeFile,
    isFileTooLarge: jest.fn(),
    transcodeVideo: getFileWithSleep,
    stripAudioFromVideo: getFileWithSleep,
    trimVideo: getFileWithSleep,
    getFirstFrameOfVideo: jest.fn(),
    convertGifToVideo: getFileWithSleep,
  })),
}));

jest.mock('../../useMediaInfo', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getFileInfo: jest.fn(() => null),
  })),
}));

jest.mock('@googleforcreators/media', () => ({
  ...jest.requireActual('@googleforcreators/media'),
  isAnimatedGif: jest.fn(),
}));

const mockUploadFile = jest.fn().mockImplementation((file) =>
  Promise.resolve(
    createResource({
      id: 123,
      src: 'http://example.com/file.ext',
      mimeType: file.type,
      elementId: 456,
    })
  )
);

const videoFile = new File(['foo'], 'video.mp4', {
  type: 'video/mp4',
  size: 5000,
});

const videoResource = createResource({
  id: 111,
  src: 'http://example.com/video.mp4',
  mimeType: 'video/mp4',
});

const imageFile = new File(['foo'], 'image.png', {
  type: 'image/png',
  size: 5000,
});

const imageResource = createResource({
  id: 222,
  src: 'http://example.com/image.png',
  mimeType: 'image/png',
});

const gifFile = new File(['foo'], 'animated.gif', {
  type: 'image/gif',
  size: 5000,
});

const gifResource = createResource({
  id: 333,
  src: 'http://example.com/animated.gif',
  mimeType: 'image/gif',
});

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
    useMediaInfo.mockClear();
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
        isElementTrimming: expect.any(Function),
        isCurrentResourceTrimming: expect.any(Function),
        isCurrentResourceUploading: expect.any(Function),
        canTranscodeResource: expect.any(Function),
      })
    );
  });

  it('should set isUploading state when adding an item to the queue', async () => {
    const { result, waitForNextUpdate, waitFor } = renderHook(() =>
      useMediaUploadQueue()
    );

    expect(result.current.state.isUploading).toBeFalse();

    act(() =>
      result.current.actions.addItem({
        file: imageFile,
        resource: imageResource,
      })
    );

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
    const { result, waitFor } = renderHook(() => useMediaUploadQueue());

    expect(result.current.state.isUploading).toBeFalse();

    act(() =>
      result.current.actions.addItem({
        file: gifFile,
        resource: gifResource,
      })
    );

    const {
      resource: { id: resourceId },
    } = result.current.state.pending[0];

    await waitFor(() => expect(result.current.state.isTranscoding).toBeTrue());

    expect(
      result.current.state.isCurrentResourceTranscoding(resourceId)
    ).toBeTrue();
  });

  it('should set isTrancoding state when adding an item to the queue', async () => {
    const { result, waitFor } = renderHook(() => useMediaUploadQueue());

    expect(result.current.state.isUploading).toBeFalse();

    act(() =>
      result.current.actions.addItem({
        file: videoFile,
        resource: videoResource,
      })
    );

    await waitFor(() => expect(result.current.state.isTranscoding).toBeTrue());

    const {
      resource: { id: resourceId },
    } = result.current.state.progress[0];

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
    const { result, waitFor } = renderHook(() => useMediaUploadQueue());

    expect(result.current.state.isUploading).toBeFalse();

    act(() =>
      result.current.actions.addItem({
        file: videoFile,
        resource: videoResource,
        muteVideo: true,
      })
    );

    await waitFor(() => expect(result.current.state.isMuting).toBeTrue());

    const {
      resource: { id: resourceId },
    } = result.current.state.progress[0];

    expect(
      result.current.state.isCurrentResourceProcessing(resourceId)
    ).toBeTrue();
    expect(result.current.state.isCurrentResourceMuting(resourceId)).toBeTrue();

    expect(result.current.state.isNewResourceProcessing(123)).toBeFalse();
    expect(result.current.state.isNewResourceMuting(123)).toBeFalse();
  });

  it('should set isTrimming state when adding an item to the queue', async () => {
    const { result, waitFor } = renderHook(() => useMediaUploadQueue());

    expect(result.current.state.isUploading).toBeFalse();

    act(() =>
      result.current.actions.addItem({
        file: videoFile,
        resource: videoResource,
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
    expect(result.current.state.isElementTrimming(456)).toBeFalse();
  });

  it('allows removing items from the queue', async () => {
    const { result, waitFor, waitForNextUpdate } = renderHook(() =>
      useMediaUploadQueue()
    );

    act(() =>
      result.current.actions.addItem({
        file: imageFile,
        resource: imageResource,
      })
    );

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
        isElementTrimming: expect.any(Function),
        isCurrentResourceTrimming: expect.any(Function),
        isCurrentResourceUploading: expect.any(Function),
        canTranscodeResource: expect.any(Function),
      })
    );
  });

  it('transcodes files sequentially', async () => {
    const { result, waitFor, waitForNextUpdate } = renderHook(() =>
      useMediaUploadQueue()
    );

    act(() =>
      result.current.actions.addItem({
        file: gifFile,
        resource: gifResource,
      })
    );
    act(() =>
      result.current.actions.addItem({
        file: videoFile,
        resource: { ...videoResource, id: 444 },
      })
    );
    act(() =>
      result.current.actions.addItem({
        file: videoFile,
        resource: { ...videoResource, id: 555 },
      })
    );
    act(() =>
      result.current.actions.addItem({
        file: videoFile,
        resource: { ...videoResource, id: 666 },
      })
    );
    act(() =>
      result.current.actions.addItem({
        file: imageFile,
        resource: imageResource,
      })
    );

    await waitForNextUpdate();

    expect(
      result.current.state.progress.filter(
        (item) => item.state === ITEM_STATUS.TRANSCODING
      )
    ).toHaveLength(1);

    await waitForNextUpdate();

    expect(
      result.current.state.progress.filter(
        (item) => item.state === ITEM_STATUS.TRANSCODING
      )
    ).toHaveLength(1);

    await waitForNextUpdate();

    await waitFor(() => expect(result.current.state.pending).toHaveLength(0));
    await waitFor(() => expect(result.current.state.progress).toHaveLength(0));
    await waitFor(() => expect(result.current.state.uploaded).toHaveLength(5));
  });

  it('transcodes files sequentially with image first', async () => {
    const { result, waitFor, waitForNextUpdate } = renderHook(() =>
      useMediaUploadQueue()
    );

    act(() =>
      result.current.actions.addItem({
        file: imageFile,
        resource: imageResource,
      })
    );
    act(() =>
      result.current.actions.addItem({
        file: gifFile,
        resource: gifResource,
      })
    );
    act(() =>
      result.current.actions.addItem({
        file: videoFile,
        resource: { ...videoResource, id: 444 },
      })
    );
    act(() =>
      result.current.actions.addItem({
        file: videoFile,
        resource: { ...videoResource, id: 555 },
      })
    );
    act(() =>
      result.current.actions.addItem({
        file: videoFile,
        resource: { ...videoResource, id: 666 },
      })
    );

    await waitForNextUpdate();

    expect(
      result.current.state.progress.filter(
        (item) => item.state === ITEM_STATUS.TRANSCODING
      )
    ).toHaveLength(1);

    await waitForNextUpdate();

    expect(
      result.current.state.progress.filter(
        (item) => item.state === ITEM_STATUS.TRANSCODING
      )
    ).toHaveLength(1);

    await waitForNextUpdate();

    await waitFor(() => expect(result.current.state.pending).toHaveLength(0));
    await waitFor(() => expect(result.current.state.progress).toHaveLength(0));
    await waitFor(() => expect(result.current.state.uploaded).toHaveLength(5));
  });
});
