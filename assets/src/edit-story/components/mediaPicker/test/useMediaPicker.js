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
import { act, renderHook } from '@testing-library/react-hooks';

/**
 * Internal dependencies
 */
import ConfigContext from '../../../app/config/context';
import useMediaPicker from '../useMediaPicker';
import SnackbarContext from '../../../app/snackbar/context';

jest.mock('../../../app/snackbar', () => ({
  useSnackbar: () => {
    return {
      showSnackbar: jest.fn(),
    };
  },
}));

function setup(args) {
  const configValue = {
    capabilities: {
      hasUploadMediaAction: true,
    },
    ...args,
  };
  const wrapper = (params) => (
    <ConfigContext.Provider value={configValue}>
      <SnackbarContext.Provider>{params.children}</SnackbarContext.Provider>
    </ConfigContext.Provider>
  );
  const onSelect = jest.fn();
  const onClose = jest.fn();
  const onPermissionError = jest.fn();
  const { result } = renderHook(
    () => useMediaPicker({ onSelect, onClose, onPermissionError }),
    {
      wrapper,
    }
  );
  return {
    openMediaPicker: result.current,
    onPermissionError,
  };
}

describe('useMediaPicker', () => {
  it('user unable to upload', () => {
    const { openMediaPicker, onPermissionError } = setup({
      capabilities: {
        hasUploadMediaAction: false,
      },
    });
    act(() => {
      openMediaPicker(new Event('click'));
    });
    expect(onPermissionError).toHaveBeenCalledTimes(1);
  });
});
