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
import useUploader from '../useUploader';

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
  const wrapper = (params) => (
    <ConfigContext.Provider value={configValue}>
      {params.children}
    </ConfigContext.Provider>
  );
  const { result } = renderHook(() => useUploader(), { wrapper });
  return {
    uploadFile: result.current.uploadFile,
    isValidType: result.current.isValidType,
  };
}

describe('useUploader', () => {
  it('throws an error when user does not have upload permissions', async () => {
    const { uploadFile } = setup({
      capabilities: {
        hasUploadMediaAction: false,
      },
    });

    await expect(uploadFile({})).rejects.toThrow(
      'Sorry, you are unable to upload files.'
    );
  });

  it('user uploads a to large file', async () => {
    const { uploadFile } = setup({
      maxUpload: 2000000,
    });

    await expect(uploadFile({ size: 3000000 })).rejects.toThrow(
      'Your file is 3MB and the upload limit is 2MB. Please resize and try again!'
    );
  });

  it('user uploads an invalid file', async () => {
    const { uploadFile } = setup({});

    await expect(uploadFile({ size: 20000, type: 'application/pdf' })).rejects.toThrow(
      'Please choose only png, jpeg, jpg, gif, mp4 to upload.'
    );
  });

  it('isValidType is given an invalid file', () => {
    const { isValidType } = setup({});

    expect(isValidType({ type: 'application/pdf' })).toBe(false);
  });
});
