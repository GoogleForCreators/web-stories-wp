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
import { useCallback, useMemo } from '@googleforcreators/react';
import {
  getTimeTracker,
  trackError,
  trackEvent,
} from '@googleforcreators/tracking';
import type { VideoResource } from '@googleforcreators/media';
import type { ReadChunkFunc } from 'mediainfo.js';

/**
 * Internal dependencies
 */
import { useConfig } from '../../config';
import {
  MEDIA_VIDEO_DIMENSIONS_THRESHOLD,
  MEDIA_VIDEO_FILE_SIZE_THRESHOLD,
  MEDIA_MIME_TYPES_OPTIMIZED_VIDEOS,
  MEDIA_RECOMMENDED_MAX_VIDEO_DURATION,
  MEDIA_RECOMMENDED_MIN_VIDEO_FPS,
} from '../../../constants';

// More specific types than the ones from mediainfo.js
// See also https://github.com/MediaArea/MediaInfoLib/tree/master/Source/Resource/Text/Stream

interface GeneralTrack {
  '@type': 'General';
  FileSize: string;
  Format: string;
  FrameRate: string;
  CodecID?: string;
}

interface ImageTrack {
  '@type': 'Image';
  Width: string;
  Height: string;
  ColorSpace: string;
}
interface VideoTrack {
  '@type': 'Video';
  Width: string;
  Height: string;
  ColorSpace: string;
  Duration: string;
  Format: string;
}

interface AudioTrack {
  '@type': 'Audio';
  Format: string;
}

type Track = GeneralTrack | ImageTrack | VideoTrack | AudioTrack;

interface ResultObject {
  '@ref': string;
  media: {
    track: Track[];
  };
}

interface MediaInfoResult {
  mimeType: string;
  fileSize: number;
  format?: string;
  codec?: string;
  frameRate?: number;
  height: number;
  width: number;
  colorSpace?: string;
  duration: number;
  videoCodec?: string;
  audioCodec?: string;
  isMuted?: boolean;
}

/**
 * Determines whether the resource/file has small enough dimensions.
 *
 * @param obj Dimensions object.
 * @param obj.width Width.
 * @param obj.height Height.
 * @return Whether the resource/file has small enough dimensions.
 */
const hasSmallDimensions = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) =>
  width * height <=
  MEDIA_VIDEO_DIMENSIONS_THRESHOLD.WIDTH *
    MEDIA_VIDEO_DIMENSIONS_THRESHOLD.HEIGHT;

/**
 * Whether the file has a reasonable file size / duration ratio.
 *
 * The recommendation for videos in stories is to be < 15s in duration
 * and < 4 MB in size. If uploading a longer video,
 * it is only natural that it will exceed the size limit.
 * Thus, we're instead checking for the average size per second.
 * Example: 4MB for a 15s video, 12MB for a 45s long video.
 *
 * @todo Revisit to avoid fallacy that we're OK with such large file sizes.
 * @param fileSize File size.
 * @param duration Duration.
 * @return Whether the file has a good file size / duration ratio.
 */
const hasSmallFileSize = (fileSize: number, duration: number) =>
  fileSize <=
  (MEDIA_VIDEO_FILE_SIZE_THRESHOLD / MEDIA_RECOMMENDED_MAX_VIDEO_DURATION) *
    duration;

/**
 * Custom hook to interact with mediainfo.js.
 *
 * @see https://mediainfo.js.org/
 * @return Functions and vars related to mediainfo.js usage.
 */
function useMediaInfo() {
  const { mediainfoUrl } = useConfig();

  const getFileInfo = useCallback(
    /**
     * Returns information about a given media file.
     *
     * @param file File object.
     * @return File info or null on error.
     */
    async (file: File) => {
      const getSize = () => file.size;

      // TODO: Look into using createFileReader from media package.
      const readChunk: ReadChunkFunc = (chunkSize, offset) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onerror = reject;
          reader.onload = (event) => {
            if (event.target?.error) {
              reject(event.target.error);
            }
            resolve(new Uint8Array(event.target?.result as ArrayBuffer));
          };
          reader.readAsArrayBuffer(file.slice(offset, offset + chunkSize));
        });

      //eslint-disable-next-line @wordpress/no-unused-vars-before-return -- False positive because of the finally().
      const trackTiming = getTimeTracker('load_mediainfo');

      try {
        const { default: MediaInfoFactory } = await import(
          /* webpackChunkName: "chunk-mediainfo" */
          /* webpackExports: "default" */
          'mediainfo.js'
        );

        const mediaInfo = await MediaInfoFactory({
          format: 'JSON',
          locateFile: () => mediainfoUrl,
        });

        const result: ResultObject = JSON.parse(
          (await mediaInfo.analyzeData(getSize, readChunk)) as unknown as string
        ) as ResultObject;

        const normalizedResult: MediaInfoResult = result.media.track.reduce(
          (acc: MediaInfoResult, track) => {
            if (track['@type'] === 'General') {
              acc.fileSize = Number(track.FileSize);
              acc.format = track.Format.toLowerCase().replace('mpeg-4', 'mp4');
              acc.frameRate = Number(Number(track.FrameRate).toFixed(0));
              acc.codec = track.CodecID?.trim();
            }

            if (track['@type'] === 'Image' || track['@type'] === 'Video') {
              acc.width = Number(track.Width);
              acc.height = Number(track.Height);
              acc.colorSpace = track.ColorSpace; // Maybe useful in the future.
            }

            if (track['@type'] === 'Video') {
              acc.duration = Number(track.Duration);
              acc.videoCodec = track.Format.toLowerCase();
            }

            if (track['@type'] === 'Audio') {
              acc.audioCodec = track.Format.toLowerCase();
            }

            return acc;
          },
          {
            mimeType: file.type,
          } as MediaInfoResult
        );

        normalizedResult.isMuted = !normalizedResult.audioCodec;

        mediaInfo.close();

        return normalizedResult;
      } catch (err) {
        // eslint-disable-next-line no-console -- We want to surface this error.
        console.error(err);

        if (err instanceof Error) {
          void trackError('mediainfo', err.message);
        }

        return null;
      } finally {
        trackTiming();
      }
    },
    [mediainfoUrl]
  );

  const isConsideredOptimized = useCallback(
    /**
     * Determines whether a video file is to be considered optimized.
     *
     * Checks things like dimensions, file size, mime type, and codecs.
     *
     * @todo Allow WebM with VP9 once Safari catches up.
     * @param resource Resource object.
     * @param file File object.
     * @return Whether the file meets optimization criteria.
     */
    async (resource: VideoResource, file: File) => {
      // This should never happen, but just in case.
      if (resource.isOptimized) {
        return true;
      }

      // Short-circuit for non-matching mime types.
      if (!MEDIA_MIME_TYPES_OPTIMIZED_VIDEOS.includes(resource.mimeType)) {
        return false;
      }

      // Placeholders are the size of the canvas, so account for that when
      // checking the dimensions.
      if (!resource.isPlaceholder && !hasSmallDimensions(resource)) {
        return false;
      }

      if (
        file.size &&
        resource.length &&
        !hasSmallFileSize(file.size, resource.length)
      ) {
        return false;
      }

      const fileInfo = await getFileInfo(file);

      if (!fileInfo) {
        return false;
      }

      // AVC is H.264.
      const isSupportedMp4 =
        fileInfo.mimeType === 'video/mp4' && fileInfo.videoCodec === 'avc';

      const hasHighFps =
        !fileInfo.frameRate ||
        fileInfo.frameRate >= MEDIA_RECOMMENDED_MIN_VIDEO_FPS;

      // Video is small enough and uses a widely supported codec.
      const result =
        hasSmallFileSize(fileInfo.fileSize, fileInfo.duration) &&
        hasSmallDimensions(fileInfo) &&
        isSupportedMp4 &&
        hasHighFps;

      void trackEvent('mediainfo_is_optimized', {
        result,
        file_size: fileInfo.fileSize,
        file_type: fileInfo.mimeType,
        width: fileInfo.width,
        height: fileInfo.height,
        duration: fileInfo.duration,
      });

      return result;
    },
    [getFileInfo]
  );

  return useMemo(
    () => ({
      getFileInfo,
      isConsideredOptimized,
    }),
    [getFileInfo, isConsideredOptimized]
  );
}

export default useMediaInfo;
