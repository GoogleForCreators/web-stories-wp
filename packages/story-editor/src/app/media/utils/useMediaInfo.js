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

/**
 * Internal dependencies
 */
import { useConfig } from '../../config';
import {
  MEDIA_VIDEO_DIMENSIONS_THRESHOLD,
  MEDIA_VIDEO_FILE_SIZE_THRESHOLD,
  MEDIA_MIME_TYPES_OPTIMIZED_VIDEOS,
  MEDIA_RECOMMENDED_MAX_VIDEO_DURATION,
} from '../../../constants';

/**
 * @typedef {import('@googleforcreators/media').Resource} Resource
 */

function loadScriptOnce(url) {
  if (document.querySelector(`script[src="${url}"]`)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = url;
    script.addEventListener('load', resolve);
    script.addEventListener('error', reject);
    document.head.appendChild(script);
  });
}

/**
 * @typedef MediaInfo
 * @property {string} mimeType File mime type.
 * @property {number} fileSize File size in bytes.
 * @property {string} format File format.
 * @property {string} codec File codec.
 * @property {number} frameRate Frame rate (rounded).
 * @property {number} height Height in px.
 * @property {number} width Width in px.
 * @property {string} colorSpace Color space.
 * @property {number} duration Video duration.
 * @property {string} videoCodec Video codec.
 * @property {string} audioCodec Audio codec.
 * @property {boolean} isMuted Whether the video is muted.
 */

/**
 * @typedef MediaInfoReturnValue
 * @property {(file: File) => Promise<MediaInfo>} getFileInfo Return media file info.
 * @property {(resource: Resource, file: File) => Promise<MediaInfo>} isConsideredOptimized Determines a resource's optimization status.
 */

/**
 * Custom hook to interact with mediainfo.js.
 *
 * @see https://mediainfo.js.org/
 * @return {MediaInfoReturnValue} Functions and vars related to mediainfo.js usage.
 */
function useMediaInfo() {
  const { mediainfoUrl } = useConfig();

  const getFileInfo = useCallback(
    /**
     * Returns information about a given media file.
     *
     * @param {File} file File object.
     * @return {Promise<MediaInfo|null>} File info or null on error.
     */
    async (file) => {
      const getSize = () => file.size;

      // TODO: Look into using createFileReader from media package.
      const readChunk = (chunkSize, offset) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onerror = reject;
          reader.onload = (event) => {
            if (event.target.error) {
              reject(event.target.error);
            }
            resolve(new Uint8Array(event.target.result));
          };
          reader.readAsArrayBuffer(file.slice(offset, offset + chunkSize));
        });

      //eslint-disable-next-line @wordpress/no-unused-vars-before-return -- False positive because of the finally().
      const trackTiming = getTimeTracker('load_mediainfo');

      try {
        // This will expose the window.MediaInfo global.
        await loadScriptOnce(mediainfoUrl);

        const mediaInfo = await window.MediaInfo({ format: 'JSON' });
        const result = JSON.parse(
          await mediaInfo.analyzeData(getSize, readChunk)
        );

        const normalizedResult = result.media.track.reduce(
          (acc, track) => {
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
          }
        );

        normalizedResult.isMuted = !normalizedResult.audioCodec;

        mediaInfo.close();

        return normalizedResult;
      } catch (err) {
        // eslint-disable-next-line no-console -- We want to surface this error.
        console.error(err);

        trackError('mediainfo', err.message);

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
     * @param {Resource} resource Resource object.
     * @param {File} file File object.
     * @return {Promise<boolean>} Whether the file meets optimization criteria.
     */
    async (resource, file) => {
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
      if (
        !resource.isPlaceholder &&
        resource.width * resource.height >
          MEDIA_VIDEO_DIMENSIONS_THRESHOLD.WIDTH *
            MEDIA_VIDEO_DIMENSIONS_THRESHOLD.HEIGHT
      ) {
        return false;
      }

      const fileInfo = await getFileInfo(file);

      if (!fileInfo) {
        return false;
      }

      // The recommendation for videos in stories is to be < 15s in duration
      // and < 4 MB in size. If uploading a longer video,
      // it is only natural that it will exceed the size limit.
      // Thus, we're instead checking for the average size per second.
      // Example: 4MB for a 15s video, 12MB for a 45s long video.
      // TODO: Revisit to avoid fallacy that we're OK with such large file sizes.
      const hasSmallFileSize =
        fileInfo.fileSize <
        (MEDIA_VIDEO_FILE_SIZE_THRESHOLD /
          MEDIA_RECOMMENDED_MAX_VIDEO_DURATION) *
          fileInfo.duration;

      const hasSmallDimensions =
        fileInfo.width * fileInfo.height <=
        MEDIA_VIDEO_DIMENSIONS_THRESHOLD.WIDTH *
          MEDIA_VIDEO_DIMENSIONS_THRESHOLD.HEIGHT;

      // AVC is H.264.
      const isSupportedMp4 =
        fileInfo.mimeType === 'video/mp4' && fileInfo.videoCodec === 'avc';

      // Video is small enough and uses a widely supported codec.
      const result = hasSmallFileSize && hasSmallDimensions && isSupportedMp4;

      trackEvent('mediainfo_is_optimized', {
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
