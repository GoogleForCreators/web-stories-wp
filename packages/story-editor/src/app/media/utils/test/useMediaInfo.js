/*
 * Copyright 2022 Google LLC
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
import { ConfigProvider } from '../../../config';
import useMediaInfo from '../useMediaInfo';

function arrange() {
  const configState = {
    mediainfoUrl: 'https://example.com',
  };

  return renderHook(() => useMediaInfo(), {
    wrapper: ({ children }) => (
      <ConfigProvider config={configState}>{children}</ConfigProvider>
    ),
  });
}

const analyzeData = jest.fn();
const mediaInfo = jest.fn(() =>
  Promise.resolve({
    analyzeData,
    close: jest.fn(),
  })
);

describe('useMediaInfo', () => {
  let mediaInfoScript;

  beforeAll(() => {
    // Tricks loadScriptOnce() into resolving immediately.
    mediaInfoScript = document.createElement('script');
    mediaInfoScript.src = 'https://example.com';
    document.documentElement.appendChild(mediaInfoScript);

    window.MediaInfo = mediaInfo;

    analyzeData.mockImplementation(() =>
      Promise.resolve(
        JSON.stringify({
          media: {
            track: [],
          },
        })
      )
    );
  });

  afterAll(() => {
    document.documentElement.removeChild(mediaInfoScript);

    delete window.MediaInfo;
  });

  afterEach(() => {
    mediaInfo.mockClear();
  });

  describe('getFileInfo', () => {
    it('should return file info', async () => {
      const { result } = arrange();

      const fileInfo = await result.current.getFileInfo(
        new File(['foo'], 'foo.mov', {
          type: 'video/quicktime',
        })
      );

      expect(fileInfo).toMatchObject({
        isMuted: true,
        mimeType: 'video/quicktime',
      });
    });
  });

  describe('isConsideredOptimized', () => {
    it('should reject false-y fileInfo', () => {
      const { result } = arrange();

      const actual = result.current.isConsideredOptimized(null);
      expect(actual).toBeFalse();
    });

    it.each`
      fileSize     | width   | height  | mimeType             | expected
      ${2_000_000} | ${1280} | ${720}  | ${'video/mp4'}       | ${true}
      ${2_000_000} | ${1280} | ${720}  | ${'video/webm'}      | ${true}
      ${9_000_000} | ${1280} | ${720}  | ${'video/mp4'}       | ${false}
      ${9_000_000} | ${1280} | ${720}  | ${'video/webm'}      | ${false}
      ${2_000_000} | ${9000} | ${720}  | ${'video/mp4'}       | ${false}
      ${2_000_000} | ${9000} | ${720}  | ${'video/webm'}      | ${false}
      ${2_000_000} | ${1280} | ${9000} | ${'video/mp4'}       | ${false}
      ${2_000_000} | ${1280} | ${9000} | ${'video/webm'}      | ${false}
      ${2_000_000} | ${1280} | ${720}  | ${'video/quicktime'} | ${false}
    `(
      'returns $expected for fileSize: $fileSize, dimensions: $widthx$height, mimeType: $mimeType',
      ({ expected, ...fileInfo }) => {
        const { result } = arrange();

        const actual = result.current.isConsideredOptimized(fileInfo);
        expect(actual).toStrictEqual(expected);
      }
    );
  });
});
