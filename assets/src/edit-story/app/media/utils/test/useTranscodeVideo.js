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
import { FlagsProvider } from 'flagged';

/**
 * Internal dependencies
 */
import React from 'react';
import CurrentUserContext from '../../../currentUser/context';
import useTranscodeVideo from '../useTranscodeVideo';

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

function arrange({ isFeatureEnabled, userSettingEnabled }) {
  const currentUser = {
    meta: {
      web_stories_media_optimization: userSettingEnabled,
    },
  };

  return renderHook(() => useTranscodeVideo(), {
    // eslint-disable-next-line react/display-name, react/prop-types
    wrapper: ({ children }) => (
      <FlagsProvider
        features={{
          videoOptimization: isFeatureEnabled,
        }}
      >
        <CurrentUserContext.Provider value={{ state: { currentUser } }}>
          {children}
        </CurrentUserContext.Provider>
      </FlagsProvider>
    ),
  });
}

describe('useTranscodeVideo', () => {
  describe('isFeatureEnabled', () => {
    it('should return true if feature is enabled', () => {
      const { result } = arrange({
        isFeatureEnabled: true,
      });
      expect(result.current.isFeatureEnabled).toBeTrue();
    });

    it('should return false if feature is disabled', () => {
      const { result } = arrange({
        isFeatureEnabled: false,
      });
      expect(result.current.isFeatureEnabled).toBeFalse();
    });
  });

  describe('isTranscodingEnabled', () => {
    it('should return true if user has enabled setting', () => {
      const { result } = arrange({
        userSettingEnabled: true,
      });
      expect(result.current.isTranscodingEnabled).toBeTrue();
    });

    it('should return false if user disabled the setting', () => {
      const { result } = arrange({
        userSettingEnabled: false,
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
