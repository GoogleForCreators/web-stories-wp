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

jest.mock('@googleforcreators/tracking', () => ({
  trackEvent: jest.fn(),
  getTimeTracker: jest.fn(() => jest.fn()),
}));

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

const BASE_RESOURCE = {
  type: 'video',
  mimeType: 'video/webm',
  creationDate: '2021-05-11T21:55:24',
  src: 'http://test.example/video.webm',
  width: 720,
  height: 1280,
  poster: 'http://test.example/video-poster.jpg',
  posterId: 92,
  id: 91,
  length: 6,
  lengthFormatted: '0:06',
  alt: 'small-video',
  sizes: {},
  isOptimized: false,
  baseColor: '#734727',
};

const OPTIMIZED_RESOURCE = {
  ...BASE_RESOURCE,
  isOptimized: true,
};

const MOV_RESOURCE = {
  ...BASE_RESOURCE,
  mimeType: 'video/quicktime',
};

const WEBM_RESOURCE = {
  ...BASE_RESOURCE,
  mimeType: 'video/webm',
};

const MP4_RESOURCE = {
  ...BASE_RESOURCE,
  mimeType: 'video/mp4',
};

const LARGE_RESOURCE = {
  ...BASE_RESOURCE,
  width: 10000,
  height: 10000,
};

const MEDIAINFO_RESULT_MP4 = JSON.stringify({
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
        FrameRate: 24.0,
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
        FrameRate: 24.0,
        ColorSpace: 'YUV',
      },
    ],
  },
});

const MEDIAINFO_RESULT_MP4_SMALL = JSON.stringify({
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
        FrameRate: 24.0,
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
        Width: 720,
        Height: 1080,
        FrameRate: 24.0,
        ColorSpace: 'YUV',
      },
    ],
  },
});

const MEDIAINFO_RESULT_WEBM = JSON.stringify({
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
});

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

  afterEach(() => {
    mediaInfo.mockClear();
  });

  afterAll(() => {
    document.documentElement.removeChild(mediaInfoScript);

    delete window.MediaInfo;
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

      analyzeData.mockImplementation(() =>
        Promise.resolve(MEDIAINFO_RESULT_MP4)
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
        frameRate: 24,
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

      analyzeData.mockImplementation(() =>
        Promise.resolve(MEDIAINFO_RESULT_WEBM)
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
    it('should bail early for already optimized resource', async () => {
      const { result } = arrange();

      const actual = await result.current.isConsideredOptimized(
        OPTIMIZED_RESOURCE,
        new File(['foo'], 'foo.mp4', {
          type: 'video/mp4',
        })
      );
      expect(actual).toBeTrue();
    });

    it('should bail early for mov resources', async () => {
      const { result } = arrange();

      const actual = await result.current.isConsideredOptimized(
        MOV_RESOURCE,
        new File(['foo'], 'foo.mov', {
          type: 'video/quicktime',
        })
      );
      expect(actual).toBeFalse();
    });

    it('should bail early for webm resources', async () => {
      const { result } = arrange();

      const actual = await result.current.isConsideredOptimized(
        WEBM_RESOURCE,
        new File(['foo'], 'foo.webm', {
          type: 'video/webm',
        })
      );
      expect(actual).toBeFalse();
    });

    it('should bail early for resources with large dimensions', async () => {
      const { result } = arrange();

      const actual = await result.current.isConsideredOptimized(
        LARGE_RESOURCE,
        new File(['foo'], 'foo.mp4', {
          type: 'video/mp4',
        })
      );
      expect(actual).toBeFalse();
    });

    it('should return false for large MP4 file', async () => {
      analyzeData.mockImplementation(() =>
        Promise.resolve(MEDIAINFO_RESULT_MP4)
      );

      const { result } = arrange();

      const actual = await result.current.isConsideredOptimized(
        MP4_RESOURCE,
        new File(['foo'], 'foo.mp4', {
          type: 'video/mp4',
        })
      );
      expect(actual).toBeFalse();
    });

    it('should return true for small MP4 file', async () => {
      analyzeData.mockImplementation(() =>
        Promise.resolve(MEDIAINFO_RESULT_MP4_SMALL)
      );

      const { result } = arrange();

      const actual = await result.current.isConsideredOptimized(
        MP4_RESOURCE,
        new File(['foo'], 'foo.mp4', {
          type: 'video/mp4',
        })
      );
      expect(actual).toBeTrue();
    });
  });
});
