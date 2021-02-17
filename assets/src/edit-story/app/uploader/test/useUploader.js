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
import ConfigContext from '../../config/context';
import APIContext from '../../api/context';
import useUploader from '../useUploader';
import useTranscodeVideo from '../../media/utils/useTranscodeVideo';

jest.mock('../../media/utils/useTranscodeVideo', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    isFeatureEnabled: true,
    isTranscodingEnabled: true,
    canTranscodeFile: jest.fn(),
    isFileTooLarge: jest.fn(),
    transcodeVideo: jest.fn(),
  })),
}));

function setup(args) {
  const configValue = {
    api: {},
    allowedMimeTypes: {
      image: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
      video: ['video/mp4'],
    },
    allowedFileTypes: ['png', 'jpeg', 'jpg', 'gif', 'mp4'],
    maxUpload: 104857600,
    capabilities: {
      hasUploadMediaAction: true,
    },
    ...args,
  };

  const apiValue = {
    actions: {
      uploadMedia: jest.fn(() => 'Upload successful!'),
    },
  };

  const wrapper = ({ children }) => (
    <ConfigContext.Provider value={configValue}>
      <APIContext.Provider value={apiValue}>{children}</APIContext.Provider>
    </ConfigContext.Provider>
  );
  const { result } = renderHook(() => useUploader(), { wrapper });

  return {
    uploadFile: result.current.uploadFile,
    isValidType: result.current.isValidType,
  };
}

describe('useUploader', () => {
  afterEach(() => {
    useTranscodeVideo.mockClear();
  });

  describe('isValidType', () => {
    it('returns false if file type is not in list', () => {
      const { isValidType } = setup({});
      expect(isValidType({ type: 'application/pdf' })).toBeFalse();
    });

    it('returns true if file type is in list', () => {
      const { isValidType } = setup({});
      expect(isValidType({ type: 'video/mp4' })).toBeTrue();
    });
  });

  describe('uploadFile', () => {
    it('throws an error if user does not have upload capabilities', async () => {
      const { uploadFile } = setup({
        capabilities: {
          hasUploadMediaAction: false,
        },
      });

      await expect(uploadFile({})).rejects.toThrow(
        'Sorry, you are unable to upload files.'
      );
    });

    it('throws an error if file is too large', async () => {
      const { uploadFile } = setup({
        maxUpload: 2000000,
      });

      await expect(uploadFile({ size: 3000000 })).rejects.toThrow(
        'Your file is 3MB and the upload limit is 2MB. Please resize and try again!'
      );
    });

    it('throws an error if file type is not supported and cannot be transcoded', async () => {
      const { uploadFile } = setup({});

      await expect(
        uploadFile({ size: 20000, type: 'video/quicktime' })
      ).rejects.toThrow(
        'Please choose only png, jpeg, jpg, gif, mp4 to upload.'
      );
    });

    it('throws an error if file is too large for transcoding', async () => {
      useTranscodeVideo.mockImplementationOnce(
        jest.fn(() => ({
          isFeatureEnabled: true,
          isTranscodingEnabled: true,
          canTranscodeFile: jest.fn(() => true),
          isFileTooLarge: jest.fn(() => true),
          transcodeVideo: jest.fn(),
        }))
      );

      const { uploadFile } = setup({
        maxUpload: 1024 * 1024 * 1024 * 10,
      });

      await expect(
        uploadFile({
          size: 1024 * 1024 * 1024 * 3,
          type: 'video/quicktime',
        })
      ).rejects.toThrow(
        'Your file is too large (3072 MB) and cannot be processed. Please try again with a file that is smaller than 2048 MB.'
      );
    });

    it('uploads video after transcoding', async () => {
      const transcodeVideo = jest.fn(
        () =>
          new File(['foo'], 'foo.mp4', {
            type: 'video/mp4',
          })
      );
      useTranscodeVideo.mockImplementationOnce(
        jest.fn(() => ({
          isFeatureEnabled: true,
          isTranscodingEnabled: true,
          canTranscodeFile: jest.fn(() => true),
          isFileTooLarge: jest.fn(() => false),
          transcodeVideo,
        }))
      );

      const { uploadFile } = setup({});

      const file = {
        size: 20000,
        type: 'video/quicktime',
      };

      const result = await uploadFile(file);
      expect(result).toStrictEqual('Upload successful!');
      expect(transcodeVideo).toHaveBeenCalledTimes(1);
      expect(transcodeVideo).toHaveBeenCalledWith(file);
    });

    it('uploads image without transcoding', async () => {
      const transcodeVideo = jest.fn();
      useTranscodeVideo.mockImplementationOnce(
        jest.fn(() => ({
          isFeatureEnabled: false,
          isTranscodingEnabled: false,
        }))
      );

      const { uploadFile } = setup({});

      const file = {
        size: 20000,
        type: 'image/png',
      };

      const result = await uploadFile(file);
      expect(result).toStrictEqual('Upload successful!');
      expect(transcodeVideo).not.toHaveBeenCalled();
    });

    it('throws an error if video transcoding failed', async () => {
      const transcodeVideo = jest
        .fn()
        .mockRejectedValue(new Error('ffmpeg error'));
      useTranscodeVideo.mockImplementationOnce(
        jest.fn(() => ({
          isFeatureEnabled: true,
          isTranscodingEnabled: true,
          canTranscodeFile: jest.fn(() => true),
          isFileTooLarge: jest.fn(() => false),
          transcodeVideo,
        }))
      );

      const { uploadFile } = setup({});

      const file = {
        size: 20000,
        type: 'video/mp4',
      };

      await expect(uploadFile(file)).rejects.toThrow(
        'Video could not be processed'
      );
      expect(transcodeVideo).toHaveBeenCalledTimes(1);
      expect(transcodeVideo).toHaveBeenCalledWith(file);
    });
  });
});
