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
} from '../../../constants';

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
 * Custom hook to interact with mediainfo.js.
 *
 * @see https://mediainfo.js.org/
 * @return {Object} Functions and vars related to mediainfo.js usage.
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

  const isConsideredOptimized = useCallback((fileInfo) => {
    if (!fileInfo) {
      return false;
    }

    const hasSmallFileSize =
      fileInfo.fileSize < MEDIA_VIDEO_FILE_SIZE_THRESHOLD;
    const hasSmallDimensions =
      fileInfo.width * fileInfo.height <=
      MEDIA_VIDEO_DIMENSIONS_THRESHOLD.WIDTH *
        MEDIA_VIDEO_DIMENSIONS_THRESHOLD.HEIGHT;

    // Video is small enough and has an allowed mime type, upload straight away.
    const result =
      hasSmallFileSize &&
      hasSmallDimensions &&
      ['video/webm', 'video/mp4'].includes(fileInfo.mimeType);

    trackEvent('mediainfo_is_optimized', {
      result,
      file_size: fileInfo.fileSize,
      file_type: fileInfo.mimeType,
      width: fileInfo.width,
      height: fileInfo.height,
      duration: fileInfo.duration,
    });

    return result;
  }, []);

  return useMemo(
    () => ({
      getFileInfo,
      isConsideredOptimized,
    }),
    [getFileInfo, isConsideredOptimized]
  );
}

export default useMediaInfo;
