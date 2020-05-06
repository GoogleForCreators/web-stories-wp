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
import useUploadMedia from '../useUploadMedia';

jest.mock('../../uploader', () => ({
  useUploader: jest.fn(() => ({
    uploadFile: jest.fn(),
  })),
}));

jest.mock('../../snackbar', () => ({
  useSnackbar: () => {
    return {
      showSnackbar: jest.fn(),
    };
  },
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
import { getResourceFromLocalFile } from '../../../app/media/utils';

describe('useUploadMedia', () => {
  it('should only setMedia for files supported by getResourceFromLocalFile', async () => {
    const supportedLocalResource = ['image', 'video'];

    const media = [
      { type: 'image/jpeg', src: 'image1.jpg' },
      { type: 'image/jpeg', src: 'image2.jpg' },
      { type: 'image/jpeg', src: 'image3.jpg' },
    ];
    const newFiles = [
      { type: 'video/mp4', src: 'video1.mp4' },
      { type: 'text/plain', src: 'text.txt' }, // Unsupported File Format
      { type: 'image/jpeg', src: 'image5.jpg' },
    ];

    const pagingNum = 1;
    const mediaType = undefined;
    const setMedia = jest.fn();
    const fetchMedia = jest.fn();

    const expectedSetMediaArgs = [
      ...media,
      ...newFiles.filter(({ type }) => supportedLocalResource.includes(type)),
    ];

    // Simple implementation of getResourceFromLocalFile that will return
    // null on unsupported resources.
    getResourceFromLocalFile.mockImplementation((e) => {
      if (supportedLocalResource.includes(e.type)) {
        return e;
      } else {
        return null;
      }
    });

    const { result } = renderHook(() =>
      useUploadMedia({
        media,
        pagingNum,
        mediaType,
        fetchMedia,
        setMedia,
      })
    );

    const { uploadMedia } = result.current;

    await act(() => uploadMedia(newFiles));

    expect(setMedia).toHaveBeenCalledTimes(1);

    const setMediaArgs = setMedia.mock.calls[0][0].media;

    // Should have skipped every unsupported file.
    expect(setMediaArgs).toIncludeSameMembers(expectedSetMediaArgs);
  });
});
