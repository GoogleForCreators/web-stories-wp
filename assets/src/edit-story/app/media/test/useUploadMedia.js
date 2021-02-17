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
import {
  getResourceFromLocalFile,
  getResourceFromAttachment,
} from '../../../app/media/utils';
import useUploadMedia from '../useUploadMedia';

const mockUploadFile = jest.fn();

jest.mock('../../uploader', () => ({
  useUploader: jest.fn(() => ({
    uploadFile: mockUploadFile,
  })),
}));

const mockShowSnackbar = jest.fn();

jest.mock('../../snackbar', () => ({
  useSnackbar: jest.fn(() => ({
    showSnackbar: mockShowSnackbar,
  })),
}));

jest.mock('../../config', () => ({
  useConfig: jest.fn(() => ({
    allowedMimeTypes: {
      image: [],
      video: [],
    },
  })),
}));

jest.mock('../../../app/media/utils');

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
    mockUploadFile.mockReset();
    getResourceFromLocalFile.mockReset();
    getResourceFromAttachment.mockReset();

    // Simple implementation of getResourceFromLocalFile that will return
    // null on unsupported resources.
    getResourceFromLocalFile.mockImplementation((e) =>
      isLocalResourceSupported(e) ? e : null
    );

    getResourceFromAttachment.mockImplementation((file) => file);
  });

  it('should bail early if no files are passed', async () => {
    const { uploadMedia, setMedia } = setup();
    await act(() => uploadMedia([]));

    expect(setMedia).toHaveBeenCalledTimes(0);
  });

  it('should display an error message if local resource could not be created', async () => {
    getResourceFromLocalFile.mockImplementation(() => {
      throw new Error('Whoopsie');
    });
    const { uploadMedia, setMedia } = setup();

    const newFiles = [{ type: 'video/mpeg', src: 'video.mpg' }];
    await act(() => uploadMedia(newFiles));

    expect(setMedia).toHaveBeenCalledTimes(0);
    expect(mockShowSnackbar).toHaveBeenCalledTimes(1);
    expect(mockShowSnackbar).toHaveBeenCalledWith({
      message: 'Whoopsie',
    });
  });

  it('should display a fallback error message if local resource could not be created', async () => {
    getResourceFromLocalFile.mockImplementation(() => {
      throw new Error();
    });
    const { uploadMedia, setMedia } = setup();

    const newFiles = [{ type: 'video/mpeg', src: 'video.mpg' }];
    await act(() => uploadMedia(newFiles));

    expect(setMedia).toHaveBeenCalledTimes(0);
    expect(mockShowSnackbar).toHaveBeenCalledTimes(1);
    expect(mockShowSnackbar).toHaveBeenCalledWith({
      message: 'File could not be uploaded. Please try a different file.',
    });
  });

  it('should display an error message when uploading files with no type', async () => {
    const { uploadMedia, setMedia } = setup();

    const newFiles = [{ type: '', src: 'video1.mkv' }];
    await act(() => uploadMedia(newFiles));

    expect(setMedia).toHaveBeenCalledTimes(0);
    expect(mockShowSnackbar).toHaveBeenCalledTimes(1);
    expect(mockShowSnackbar).toHaveBeenCalledWith({
      message:
        'One or more files could not be uploaded. Please try a different file.',
    });
  });

  it('should only setMedia for files supported by getResourceFromLocalFile', async () => {
    const { uploadMedia, setMedia, media } = setup();

    const newFiles = [
      { type: 'video/mp4', src: 'video1.mp4' },
      { type: 'text/plain', src: 'text.txt' }, // Unsupported File Format
      { type: 'image/jpeg', src: 'image5.jpg' },
    ];
    await act(() => uploadMedia(newFiles));

    // Should have skipped each unsupported file.
    expect(setMedia).toHaveBeenCalledTimes(2);
    expect(setMedia.mock.calls[0][0].media).toIncludeSameMembers([
      ...newFiles.filter(isLocalResourceSupported),
      ...media,
    ]);
  });

  it('before upload should setMedia for local version of resource', async () => {
    const { uploadMedia, setMedia, media } = setup();

    const newFiles = [
      { type: 'video/mp4', src: 'video1.mp4' },
      { type: 'image/jpeg', src: 'image5.jpg' },
    ];
    await act(() => uploadMedia(newFiles));

    // Should have added each local file to be uploaded.
    expect(setMedia).toHaveBeenCalledTimes(2);
    expect(setMedia.mock.calls[0][0].media).toIncludeSameMembers([
      ...newFiles,
      ...media,
    ]);
  });

  it('after upload should setMedia for remote version of resource', async () => {
    const { uploadMedia, setMedia, media } = setup();

    mockUploadFile.mockImplementation((file) => {
      return {
        ...file,
        title: `title of ${file.src}`,
      };
    });

    const newFiles = [
      { type: 'image/jpeg', src: 'image5.jpg' },
      { type: 'video/mp4', src: 'video1.mp4' },
    ];
    await act(() => uploadMedia(newFiles));

    // Should have updated each uploaded file with the remote version.
    expect(setMedia).toHaveBeenCalledTimes(2);
    expect(setMedia.mock.calls[1][0].media).toIncludeSameMembers([
      { type: 'image/jpeg', src: 'image5.jpg', title: 'title of image5.jpg' },
      { type: 'video/mp4', src: 'video1.mp4', title: 'title of video1.mp4' },
      ...media,
    ]);
  });
});
