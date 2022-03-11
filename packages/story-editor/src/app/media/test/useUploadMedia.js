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
import { renderHook, act } from '@testing-library/react-hooks';

/**
 * Internal dependencies
 */
import { getResourceFromLocalFile } from '../utils';
import useUploadMedia from '../useUploadMedia';

const mockValidateFileForUpload = jest.fn();

jest.mock('../../uploader', () => ({
  useUploader: jest.fn(() => ({
    actions: {
      validateFileForUpload: mockValidateFileForUpload,
    },
  })),
}));

const mockAddItem = jest.fn();
const mockRemoveItem = jest.fn();

jest.mock('../utils/useMediaUploadQueue', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    actions: {
      addItem: mockAddItem,
      removeItem: mockRemoveItem,
    },
    state: {
      isUploading: false,
      isTranscoding: false,
      pending: [],
      progress: [],
      uploaded: [],
      failures: [],
      finished: [],
    },
  })),
}));

const mockShowSnackbar = jest.fn();

jest.mock('@googleforcreators/design-system', () => ({
  ...jest.requireActual('@googleforcreators/design-system'),
  useSnackbar: jest.fn(() => ({
    showSnackbar: mockShowSnackbar,
  })),
}));

jest.mock('../../config', () => ({
  useConfig: jest.fn(() => ({
    allowedMimeTypes: {
      image: [],
      vector: [],
      video: [],
      caption: [],
      audio: [],
    },
  })),
}));

jest.mock('../../../app/media/utils');

jest.mock('../utils/useFFmpeg', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    isTranscodingEnabled: true,
    canTranscodeFile: jest.fn(),
    isFileTooLarge: jest.fn(),
    transcodeVideo: jest.fn(),
  })),
}));

function setup() {
  const media = [
    { type: 'image/jpeg', src: 'image1.jpg' },
    { type: 'image/jpeg', src: 'image2.jpg' },
    { type: 'image/jpeg', src: 'image3.jpg' },
  ];

  const setMedia = jest.fn();

  const { result } = renderHook(() =>
    useUploadMedia({
      media,
      setMedia,
    })
  );

  const { uploadMedia } = result.current;
  return {
    uploadMedia,
    setMedia,
    media,
  };
}

const supportedLocalResourceTypes = ['image', 'video'];

function isLocalResourceSupported(resource) {
  return supportedLocalResourceTypes.some((type) =>
    resource.type.startsWith(type)
  );
}

describe('useUploadMedia', () => {
  beforeEach(() => {
    mockShowSnackbar.mockReset();
    getResourceFromLocalFile.mockReset();

    // Simple implementation of getResourceFromLocalFile that will return
    // null on unsupported resources.
    getResourceFromLocalFile.mockImplementation((e) =>
      isLocalResourceSupported(e) ? e : null
    );
  });

  it('bails early if no files are passed', async () => {
    const { uploadMedia } = setup();
    await act(() => uploadMedia([]));

    expect(mockAddItem).not.toHaveBeenCalled();
  });

  it('displays error message if file does not validate for upload', async () => {
    mockValidateFileForUpload.mockImplementationOnce(() => {
      throw new Error('Whoopsie');
    });

    const { uploadMedia, setMedia } = setup();

    const newFiles = [{ type: 'video/mpeg', src: 'video.mpg' }];
    await act(() => uploadMedia(newFiles));

    expect(setMedia).toHaveBeenCalledTimes(0);
    expect(mockShowSnackbar).toHaveBeenCalledTimes(1);
    expect(mockShowSnackbar).toHaveBeenCalledWith({
      message: 'Whoopsie',
      dismissible: true,
    });
  });
});
