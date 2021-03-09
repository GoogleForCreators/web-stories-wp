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

jest.mock('../../snackbar', () => ({
  useSnackbar: () => ({ showSnackbar: mockShowSnackbar }),
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

      await expect(() => validateFileForUpload({})).toThrow(
        'Sorry, you are unable to upload files.'
      );
    });

    it('throws an error if file is too large', async () => {
      const {
        actions: { validateFileForUpload },
      } = setup({
        maxUpload: 2000000,
      });

      await expect(() => validateFileForUpload({ size: 3000000 })).toThrow(
        'Your file is 3MB and the upload limit is 2MB. Please resize and try again!'
      );
    });

    it('throws an error if file type is not supported and cannot be transcoded', async () => {
      const {
        actions: { validateFileForUpload },
      } = setup({});

      await expect(() =>
        validateFileForUpload({ size: 20000, type: 'video/quicktime' })
      ).toThrow('Please choose only png, jpeg, jpg, gif, mp4 to upload.');
    });

    it('throws an error if file is too large for transcoding', async () => {
      const {
        actions: { validateFileForUpload },
      } = setup({
        maxUpload: 1024 * 1024 * 1024 * 10,
      });

      await expect(() =>
        validateFileForUpload(
          {
            size: 1024 * 1024 * 1024 * 3,
            type: 'video/quicktime',
          },
          true,
          true
        )
      ).toThrow(
        'Your file is too large (3072 MB) and cannot be processed. Please try again with a file that is smaller than 2048 MB.'
      );
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
      expect(result).toStrictEqual('Upload successful!');
    });
  });
});
