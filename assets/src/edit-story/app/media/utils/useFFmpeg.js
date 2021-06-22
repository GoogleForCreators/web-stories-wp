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
import { v4 as uuidv4 } from 'uuid';
import { useCallback, useMemo } from 'react';
import { getTimeTracker, trackError } from '@web-stories-wp/tracking';
import { getFileName } from '@web-stories-wp/media';

/**
 * Internal dependencies
 */
import { useConfig } from '../../config';
import { useCurrentUser } from '../../currentUser';
import {
  MEDIA_TRANSCODING_MAX_FILE_SIZE,
  MEDIA_VIDEO_DIMENSIONS_THRESHOLD,
  MEDIA_TRANSCODED_MINE_TYPE,
  MEDIA_TRANSCODED_FILE_TYPE,
} from '../../../constants';

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Checks whether the file size is too large for transcoding.
 *
 * @see https://github.com/ffmpegwasm/ffmpeg.wasm/tree/9b56b7f05b552c404aa0f62f46bed2592d9daf06#what-is-the-maximum-size-of-input-file
 * @param {File} file File object.
 * @param {number} file.size File size.
 * @return {boolean} Whether the file is too  large.
 */
const isFileTooLarge = ({ size }) => size >= MEDIA_TRANSCODING_MAX_FILE_SIZE;

const FFMPEG_SHARED_CONFIG = [
  // Use H.264 video codec.
  '-vcodec',
  'libx264',
  // Scale down to 720p as recommended by Storytime.
  // See https://trac.ffmpeg.org/wiki/Scaling
  // Adds 1px pad to width/height if they're not divisible by 2, which FFmpeg will complain about.
  '-vf',
  `scale='min(${MEDIA_VIDEO_DIMENSIONS_THRESHOLD.HEIGHT},iw)':'min(${MEDIA_VIDEO_DIMENSIONS_THRESHOLD.WIDTH},ih)':'force_original_aspect_ratio=decrease',pad='width=ceil(iw/2)*2:height=ceil(ih/2)*2'`,
  // Reduce to 24fps as recommended by Storytime.
  // See https://trac.ffmpeg.org/wiki/ChangingFrameRate
  '-r',
  '24',
  // move some information to the beginning of your file.
  '-movflags',
  '+faststart',
  // Simpler color profile
  '-pix_fmt',
  'yuv420p',
  // As the name says...
  '-preset',
  'fast', // 'veryfast' seems to cause crashes.
];

/**
 * @typedef FFmpegData
 * @property {boolean} isFeatureEnabled Whether the feature is enabled.
 * @property {(file: File) => boolean} isFileTooLarge Whether a given file is too large.
 * @property {boolean} isTranscodingEnabled Whether transcoding is enabled.
 * @property {(file: File) => boolean} canTranscodeFile Whether a given file can be transcoded.
 * @property {(file: File) => Promise<File>} transcodeVideo Transcode a given video.
 * @property {(file: File) => Promise<File>} getFirstFrameOfVideo Get the first frame of a video.
 * @property {(file: File) => Promise<File>} convertGifToVideo Convert GIF to MP4.
 */

/**
 * Custom hook to interact with FFmpeg.
 *
 * @see https://ffmpeg.org/ffmpeg.html
 * @return {FFmpegData} Functions and vars related to FFmpeg usage.
 */
function useFFmpeg() {
  const { ffmpegCoreUrl, allowedTranscodableMimeTypes } = useConfig();
  const {
    state: { currentUser },
  } = useCurrentUser();

  /**
   * Whether the video optimization feature is enabled.
   *
   *
   * @type {boolean} Whether the feature flag is enabled.
   */
  const isFeatureEnabled = Boolean(window?.crossOriginIsolated);

  const getFFmpegInstance = useCallback(
    async (file) => {
      const { createFFmpeg, fetchFile } = await import(
        /* webpackChunkName: "chunk-ffmpeg" */ '@ffmpeg/ffmpeg'
      );

      const ffmpeg = createFFmpeg({
        corePath: ffmpegCoreUrl,
        log: isDevelopment,
      });
      await ffmpeg.load();

      ffmpeg.FS('writeFile', file.name, await fetchFile(file));

      return ffmpeg;
    },
    [ffmpegCoreUrl]
  );

  /**
   * Extract a video's first frame using FFmpeg.
   *
   * Exact seeking is not possible in most formats, so ffmpeg will seek to the closest seek point before position.
   *
   * @param {File} file Original video file object.
   * @return {Promise<File>} File object for the video frame.
   */
  const getFirstFrameOfVideo = useCallback(
    async (file) => {
      //eslint-disable-next-line @wordpress/no-unused-vars-before-return
      const trackTiming = getTimeTracker('load_video_poster_ffmpeg');

      try {
        const ffmpeg = await getFFmpegInstance(file);

        const tempFileName = uuidv4() + '.jpeg';
        const outputFileName = getFileName(file) + '.jpeg';

        await ffmpeg.run(
          // Desired position.
          // Using as an input option (before -i) saves us some time by seeking to position.
          '-ss',
          '00:00:01.000',
          // Input filename.
          '-i',
          file.name,
          // Stop writing to the stream after 1 frame.
          '-frames:v',
          '1',
          // Scale down to 720p as recommended by Storytime.
          // See https://trac.ffmpeg.org/wiki/Scaling
          // Adds 1px pad to width/height if they're not divisible by 2, which FFmpeg will complain about.
          '-vf',
          `scale='min(${MEDIA_VIDEO_DIMENSIONS_THRESHOLD.HEIGHT},iw)':'min(${MEDIA_VIDEO_DIMENSIONS_THRESHOLD.WIDTH},ih)':'force_original_aspect_ratio=decrease',pad='width=ceil(iw/2)*2:height=ceil(ih/2)*2'`,
          // Simpler color profile
          '-pix_fmt',
          'yuv420p',
          // As the name says...
          '-preset',
          'fast', // 'veryfast' seems to cause crashes.
          // Output filename. MUST be different from input filename.
          tempFileName
        );

        const data = ffmpeg.FS('readFile', tempFileName);
        return new File(
          [new Blob([data.buffer], { type: 'image/jpeg' })],
          outputFileName,
          {
            type: 'image/jpeg',
          }
        );
      } catch (err) {
        trackError('video_poster_generation_ffmpeg', err.message);
        throw err;
      } finally {
        trackTiming();
      }
    },
    [getFFmpegInstance]
  );

  /**
   * Transcode a video using FFmpeg.
   *
   * @param {File} file Original video file object.
   * @return {Promise<File>} Transcoded video file object.
   */
  const transcodeVideo = useCallback(
    async (file) => {
      //eslint-disable-next-line @wordpress/no-unused-vars-before-return
      const trackTiming = getTimeTracker('load_video_transcoding');

      try {
        const ffmpeg = await getFFmpegInstance(file);

        const tempFileName = uuidv4() + MEDIA_TRANSCODED_FILE_TYPE;
        const outputFileName = getFileName(file) + MEDIA_TRANSCODED_FILE_TYPE;

        await ffmpeg.run(
          // Input filename.
          '-i',
          file.name,
          ...FFMPEG_SHARED_CONFIG,
          // Output filename. MUST be different from input filename.
          tempFileName
        );

        const data = ffmpeg.FS('readFile', tempFileName);
        return new File(
          [new Blob([data.buffer], { type: MEDIA_TRANSCODED_MINE_TYPE })],
          outputFileName,
          {
            type: MEDIA_TRANSCODED_MINE_TYPE,
          }
        );
      } catch (err) {
        trackError('video_transcoding', err.message);
        throw err;
      } finally {
        trackTiming();
      }
    },
    [getFFmpegInstance]
  );

  /**
   * Converts an animated GIF to a video using FFmpeg.
   *
   * @param {File} file Original GIF file object.
   * @return {Promise<File>} Converted video file object.
   */
  const convertGifToVideo = useCallback(
    async (file) => {
      //eslint-disable-next-line @wordpress/no-unused-vars-before-return
      const trackTiming = getTimeTracker('load_gif_conversion');

      try {
        const ffmpeg = await getFFmpegInstance(file);

        const tempFileName = uuidv4() + MEDIA_TRANSCODED_FILE_TYPE;
        const outputFileName = getFileName(file) + MEDIA_TRANSCODED_FILE_TYPE;

        await ffmpeg.run(
          // Input filename.
          '-i',
          file.name,
          ...FFMPEG_SHARED_CONFIG,
          // Output filename. MUST be different from input filename.
          tempFileName
        );

        const data = ffmpeg.FS('readFile', tempFileName);
        return new File(
          [new Blob([data.buffer], { type: MEDIA_TRANSCODED_MINE_TYPE })],
          outputFileName,
          {
            type: MEDIA_TRANSCODED_MINE_TYPE,
          }
        );
      } catch (err) {
        trackError('gif_conversion', err.message);
        throw err;
      } finally {
        trackTiming();
      }
    },
    [getFFmpegInstance]
  );

  /**
   * Determines whether the given file can be transcoded.
   *
   * @param {File} file File object.
   * @return {boolean} Whether transcoding is likely possible.
   */
  const canTranscodeFile = useCallback(
    (file) => allowedTranscodableMimeTypes.includes(file.type),
    [allowedTranscodableMimeTypes]
  );

  /**
   * Whether user opted in to video optimization.
   *
   * @type {boolean}
   */
  const isTranscodingEnabled = Boolean(
    currentUser.meta?.web_stories_media_optimization
  );

  return useMemo(
    () => ({
      isFeatureEnabled,
      isTranscodingEnabled,
      canTranscodeFile,
      isFileTooLarge,
      transcodeVideo,
      getFirstFrameOfVideo,
      convertGifToVideo,
    }),
    [
      isFeatureEnabled,
      isTranscodingEnabled,
      canTranscodeFile,
      transcodeVideo,
      getFirstFrameOfVideo,
      convertGifToVideo,
    ]
  );
}

export default useFFmpeg;
