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
import { renderHook } from '@testing-library/react-hooks';

/**
 * Internal dependencies
 */
import CurrentUserContext from '../../../currentUser/context';
import useFFmpeg from '../useFFmpeg';
import { ConfigProvider } from '../../../config';

jest.mock('@ffmpeg/ffmpeg', () => {
  return {
    createFFmpeg: jest.fn(() => ({
      load: jest.fn(),
      run: jest.fn(),
      FS: jest.fn(() => ({ buffer: 'foo' })),
    })),
    fetchFile: jest.fn(),
  };
});

function arrange({ userSettingEnabled, hasUploadMediaAction }) {
  const currentUser = {
    mediaOptimization: userSettingEnabled,
  };
  const configState = {
    capabilities: {
      hasUploadMediaAction,
    },
  };

  return renderHook(() => useFFmpeg(), {
    wrapper: ({ children }) => (
      <ConfigProvider config={configState}>
        <CurrentUserContext.Provider value={{ state: { currentUser } }}>
          {children}
        </CurrentUserContext.Provider>
      </ConfigProvider>
    ),
  });
}

describe('useFFmpeg', () => {
  describe('isTranscodingEnabled', () => {
    afterEach(() => {
      delete window.crossOriginIsolated;
    });

    it('should return false if there is no cross-origin isolation', () => {
      const { result } = arrange({
        userSettingEnabled: true,
        hasUploadMediaAction: true,
      });
      expect(result.current.isTranscodingEnabled).toBeFalse();
    });

    it('should return true if cross-origin isolation is setup', () => {
      window.crossOriginIsolated = true;
      const { result } = arrange({
        userSettingEnabled: true,
        hasUploadMediaAction: true,
      });
      expect(result.current.isTranscodingEnabled).toBeTrue();
    });

    it('should return false if user has no upload permissions', () => {
      window.crossOriginIsolated = true;
      const { result } = arrange({
        hasUploadMediaAction: false,
        userSettingEnabled: true,
      });
      expect(result.current.isTranscodingEnabled).toBeFalse();
    });
  });

  describe('canTranscodeFile', () => {
    it('should return true for video files', () => {
      const file = new File(['foo'], 'foo.mov', {
        type: 'video/quicktime',
      });

      const { result } = arrange({});
      expect(result.current.canTranscodeFile(file)).toBeTrue();
    });

    it('should return false if file is not a video', () => {
      const file = new File(['foo'], 'foo.txt', {
        type: 'text/plain',
      });

      const { result } = arrange({});
      expect(result.current.canTranscodeFile(file)).toBeFalse();
    });
  });

  describe('isFileTooLarge', () => {
    it('returns true if file is over 2GB', () => {
      const file = {
        size: 1024 * 1024 * 1024 * 2,
      };

      const { result } = arrange({});
      expect(result.current.isFileTooLarge(file)).toBeTrue();
    });

    it('returns false if file is less than 2GB', () => {
      const file = {
        size: 1024 * 1024 * 1024,
      };

      const { result } = arrange({});
      expect(result.current.isFileTooLarge(file)).toBeFalse();
    });
  });

  describe('transcodeVideo', () => {
    it('should transcode a MOV file into an MP4', async () => {
      const file = new File(['foo'], 'foo.mov', {
        type: 'video/quicktime',
      });

      const { result } = arrange({});
      const newFile = await result.current.transcodeVideo(file);
      expect(newFile.type).toBe('video/mp4');
      expect(newFile.name).toBe('foo.mp4');
    });
  });
});
