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

const mockShowSnackbar = jest.fn();

jest.mock('@googleforcreators/design-system', () => ({
  ...jest.requireActual('@googleforcreators/design-system'),
  useSnackbar: () => ({ showSnackbar: mockShowSnackbar }),
}));

function setup(args) {
  const configValue = {
    api: {},
    allowedMimeTypes: {
      audio: ['audio/mpeg', 'audio/aac', 'audio/wav', 'audio/ogg'],
      image: [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/gif',
        'image/webp',
      ],
      caption: ['text/vtt'],
      vector: [],
      video: ['video/mp4', 'video/webm'],
    },
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
    actions: result.current.actions,
  };
}

describe('useUploader', () => {
  beforeEach(() => {
    mockShowSnackbar.mockReset();
  });

  describe('validateFileForUpload', () => {
    it('throws an error if user does not have upload capabilities', async () => {
      const {
        actions: { validateFileForUpload },
      } = setup({
        capabilities: {
          hasUploadMediaAction: false,
        },
      });

      await expect(() => validateFileForUpload({ file: {} })).toThrow(
        'Sorry, you are not allowed to upload files.'
      );
    });

    it('throws an error if file is too large', async () => {
      const {
        actions: { validateFileForUpload },
      } = setup({
        maxUpload: 2000000,
      });

      await expect(() =>
        validateFileForUpload({ file: { size: 3000000 } })
      ).toThrow(
        'Your file is 3MB and the upload limit is 2MB. Please resize and try again!'
      );
    });

    it('throws an error if file type is not supported and cannot be transcoded', async () => {
      const {
        actions: { validateFileForUpload },
      } = setup({});

      await expect(() =>
        validateFileForUpload({
          file: { size: 20000, type: 'video/quicktime' },
        })
      ).toThrow(
        'Please choose only png, jpg, jpeg, gif, webp, mp4, or webm to upload.'
      );
    });

    it('throws an error if file type is not supported and in list of mime types', async () => {
      const {
        actions: { validateFileForUpload },
      } = setup({});

      await expect(() =>
        validateFileForUpload({
          file: { size: 20000, type: 'video/quicktime' },
          overrideAllowedMimeTypes: ['video/mp4'],
        })
      ).toThrow('Please choose only mp4 to upload.');
    });

    it('throws an error if file too large to transcode', async () => {
      const {
        actions: { validateFileForUpload },
      } = setup({});

      await expect(() =>
        validateFileForUpload({
          file: { size: 1024 * 1024 * 1024 * 2, type: 'video/mp4' },
          canTranscodeFile: true,
          isFileTooLarge: true,
        })
      ).toThrow(
        'Your file is too large (2048 MB) and cannot be processed. Please try again with a file that is smaller than 2048 MB.'
      );
    });

    it('throws an error if file is too large for transcoding', async () => {
      const {
        actions: { validateFileForUpload },
      } = setup({
        maxUpload: 1024 * 1024 * 1024 * 10,
      });

      await expect(() =>
        validateFileForUpload({
          file: { size: 1024 * 1024 * 1024 * 3, type: 'video/quicktime' },
          canTranscodeFile: true,
          isFileTooLarge: true,
        })
      ).toThrow(
        'Your file is too large (3072 MB) and cannot be processed. Please try again with a file that is smaller than 2048 MB.'
      );
    });

    it('does not throw an error if file is too large to upload but can be transcoded', async () => {
      const {
        actions: { validateFileForUpload },
      } = setup({});

      await expect(() =>
        validateFileForUpload({
          file: { size: 1024 * 1024 * 150, type: 'video/mp4' },
          canTranscodeFile: true,
          isFileTooLarge: false,
        })
      ).not.toThrow();
    });

    it('throws an error if file is too large to transcode or upload', async () => {
      const {
        actions: { validateFileForUpload },
      } = setup({});

      await expect(() =>
        validateFileForUpload({
          file: { size: 1024 * 1024 * 1024 * 2, type: 'video/mp4' },
          canTranscodeFile: false,
          isFileTooLarge: true,
        })
      ).toThrow(
        'Your file is 2048MB and the upload limit is 100MB. Please resize and try again!'
      );
    });

    it('does not throw an error if file is not too large to upload', async () => {
      const {
        actions: { validateFileForUpload },
      } = setup({});

      await expect(() =>
        validateFileForUpload({
          file: { size: 1024 * 1024 * 50, type: 'video/mp4' },
          canTranscodeFile: false,
          isFileTooLarge: false,
        })
      ).not.toThrow();
    });

    it('formats the error message correctly if there is only one file type supported', async () => {
      const {
        actions: { validateFileForUpload },
      } = setup({
        allowedMimeTypes: { image: [], video: ['video/mp4'], vector: [] },
      });

      await expect(() =>
        validateFileForUpload({
          file: { size: 20000, type: 'video/quicktime' },
        })
      ).toThrow('Please choose only mp4 to upload.');
    });

    it('formats the error message correctly if no file types are supported', async () => {
      const {
        actions: { validateFileForUpload },
      } = setup({ allowedMimeTypes: { image: [], video: [], vector: [] } });

      await expect(() =>
        validateFileForUpload({
          file: { size: 20000, type: 'video/quicktime' },
        })
      ).toThrow('No file types are currently supported.');
    });
  });

  describe('uploadFile', () => {
    it('uploads image', async () => {
      const {
        actions: { uploadFile },
      } = setup({});

      const file = {
        size: 20000,
        type: 'image/png',
      };

      const result = await uploadFile(file);
      expect(result).toBe('Upload successful!');
    });
  });
});
