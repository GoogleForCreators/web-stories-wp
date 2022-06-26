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

jest.mock('@googleforcreators/tracking');

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

    it('should return file info for muted mp4 file', async () => {
      const { result } = arrange();

      analyzeData.mockImplementationOnce(() =>
        Promise.resolve(
          JSON.stringify({
            media: {
              track: [
                {
                  '@type': 'General',
                  VideoCount: 1,
                  Format: 'MPEG-4',
                  Format_Profile: 'Base Media',
                  CodecID: 'mp42',
                  CodecID_Compatible: 'mp41/isom',
                  FileSize: 301084,
                  Duration: 18.0,
                  OverallBitRate: 133815,
                  FrameRate: 20.0,
                  FrameCount: 360,
                  StreamSize: 2233,
                  HeaderSize: 64,
                  DataSize: 298867,
                  FooterSize: 2153,
                  IsStreamable: false,
                },
                {
                  '@type': 'Video',
                  Format: 'AVC',
                  CodecID: 'avc1',
                  Duration: 18.0,
                  BitRate: 132823,
                  Width: 1920,
                  Height: 1080,
                  FrameRate: 20.0,
                  ColorSpace: 'YUV',
                },
              ],
            },
          })
        )
      );

      const fileInfo = await result.current.getFileInfo(
        new File(['foo'], 'foo.mp4', {
          type: 'video/mp4',
        })
      );

      expect(fileInfo).toMatchObject({
        isMuted: true,
        mimeType: 'video/mp4',
        fileSize: 301084,
        format: 'mp4',
        frameRate: 20,
        codec: 'mp42',
        width: 1920,
        height: 1080,
        colorSpace: 'YUV',
        duration: 18,
        videoCodec: 'avc',
      });
    });

    it('should return file info for webm file', async () => {
      const { result } = arrange();

      analyzeData.mockImplementationOnce(() =>
        Promise.resolve(
          JSON.stringify({
            media: {
              track: [
                {
                  '@type': 'General',
                  VideoCount: 1,
                  AudioCount: 1,
                  Format: 'WebM',
                  Format_Version: 4,
                  FileSize: 226548,
                  Duration: 5.568,
                  OverallBitRate: 325500,
                  FrameRate: 30.0,
                  FrameCount: 167,
                  IsStreamable: true,
                },
                {
                  '@type': 'Video',
                  StreamOrder: 0,
                  Format: 'VP9',
                  CodecID: 'V_VP9',
                  Duration: 5.567,
                  Width: 560,
                  Height: 320,
                  PixelAspectRatio: 1.0,
                  DisplayAspectRatio: 1.75,
                  FrameRate_Mode: 'CFR',
                  FrameRate: 30.0,
                  FrameCount: 167,
                  Default: true,
                  Forced: false,
                },
                {
                  '@type': 'Audio',
                  StreamOrder: 1,
                  Format: 'Opus',
                  CodecID: 'A_OPUS',
                  Duration: 5.568,
                  Channels: 1,
                  ChannelPositions: 'Front: C',
                  SamplingRate: 48000,
                  SamplingCount: 267264,
                },
              ],
            },
          })
        )
      );

      const fileInfo = await result.current.getFileInfo(
        new File(['foo'], 'foo.webm', {
          type: 'video/webm',
        })
      );

      expect(fileInfo).toMatchObject({
        isMuted: false,
        mimeType: 'video/webm',
        fileSize: 226548,
        format: 'webm',
        frameRate: 30,
        codec: undefined,
        width: 560,
        height: 320,
        colorSpace: undefined,
        duration: 5.567,
        videoCodec: 'vp9',
        audioCodec: 'opus',
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
